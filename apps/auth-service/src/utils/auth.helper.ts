import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../../../packages/error-handler/index.js";
import { redis } from "../../../../packages/libs/redis/index.js";
import { sendEmail } from "./sendmail/index.js";
import prisma from "@packages/libs/prisma/index.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegisterationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;
  if (userType === "seller") {
    if (!phone_number || !country || !name || !email || !password) {
      throw new ValidationError(
        `Missing required fields for ${userType} registration`
      );
    }
  } else {
    if (!data.name || !data.email || !data.password) {
      throw new ValidationError(
        `Missing required fields for ${userType} registration`
      );
    }
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email address");
  }
};
export const checkOtpRestriction = async (
  email: string,
  next: NextFunction
) => {
  //we use redis here
  //if user fail 3 time his/her account block for some time
  //first check in redis if that lock email is present or not
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Account looked due to multiple failed attempts,try again after 30 minutes"
      )
    );
  }
  if (await redis.get(`otp_spam_email:${email}`)) {
    return next(
      new ValidationError(
        "Too many OTP requests! Please wait 1 hour before requesting again."
      )
    );
  }
  if (await redis.get(`otp_cooldown_email:${email}`)) {
    return next(
      new ValidationError("Please 1 minute before requesting new OTP.")
    );
  }
};
export const trackOptRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");
  if (otpRequests >= 2) {
    await redis.set(`otp_spam_email:${email}`, "locked", "EX", 3600); //add span for 1 hour
    return next(
      new ValidationError(
        "Too many OTP requests! Please wait 1 hour before requesting again."
      )
    );
  }
  //now set otp request key
  await redis.set(`otp_request_count:${email}`, otpRequests + 1, "EX", 3600); //->tracking request
};
export const sendOtp = async (
  name: string,
  email: string,
  subject: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString(); //4 digit otp
  await sendEmail(email, subject, template, { name, otp }); //"Verify your mail"
  //set this otp in redis ->5min setx fn
  await redis.set(`otp:${email}`, otp, "EX", 300); //->5min
  //take 1 min than send again otp
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};
export const verifyOTP = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const storeOTP = await redis.get(`otp:${email}`);
  if (!storeOTP) {
    throw new ValidationError("OTP is expired now.");
  }
  const failedAttemptskey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptskey)) || "0");
  if (storeOTP !== otp) {
    if (failedAttempts >= 2) {
      await redis.del(`otp_${email}`, failedAttemptskey);
      throw new ValidationError(
        "Too many failed attempts.Your account is looked for 30 mins."
      );
    }
    await redis.set(failedAttemptskey, failedAttempts + 1, "EX", 300); //expire after 5 mins
    throw new ValidationError(
      `Incorrect OTP ${2 - failedAttempts} attempts left`
    );
  }
  await redis.del(`otp_${email}`, failedAttemptskey);
};
export const handleForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw next(new ValidationError("Email is required"));
    }
    //find user and seller in DB
    const user =
      userType === "user" &&
      (await prisma.users.findUnique({ where: { email } }));
    if (!user) {
      throw new ValidationError(`${userType} not found!`);
    }
    //check otp restriction
    await checkOtpRestriction(email, next);
    //generate otp
    await sendOtp(
      user.name,
      email,
      "Forget Password Mail",
      "forget-Password-mail"
    );
    res
      .status(200)
      .json({ message: "OTP send to the mail please verify your account." });
  } catch (error) {
    next(error);
  }
};
export const verifyForgotPasswordOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new ValidationError(`Missing required fields.`);
    }
    await verifyOTP(email, otp, next);
    res
      .status(200)
      .json({ message: "OTP verified . You can now verify your password." });
  } catch (error) {
    next(error);
  }
};
