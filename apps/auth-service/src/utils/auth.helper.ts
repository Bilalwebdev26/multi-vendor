import crypto from "crypto";
import { NextFunction } from "express";
import { ValidationError } from "../../../../packages/error-handler/index.js";
import { redis } from "../../../../packages/libs/redis/index.js";
import { sendEmail } from "./sendmail/index.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegisterationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;
  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (phone_number || country))
  ) {
    throw new ValidationError(
      `Missing required fields for ${userType} registration`
    );
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
  await redis.set(`otp_request_count:${email}`, otpRequests + 1, "EX", 3600);//->tracking request
};
export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString(); //4 digit otp
  await sendEmail(email, "Verify your mail", template, { name, otp });
  //set this otp in redis ->5min setx fn
  await redis.set(`otp:${email}`, otp, "EX", 300); //->5min
  //take 1 min than send again otp
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};
