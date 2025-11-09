import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestriction,
  handleForgetPassword,
  sendOtp,
  trackOptRequests,
  validateRegisterationData,
  verifyForgotPasswordOTP,
  verifyOTP,
} from "../utils/auth.helper.js";
// import prisma from "../../../../packages/libs/prisma";
// import { ValidationError } from "../../../../packages/error-handler";
import prisma from "../../../../packages/libs/prisma/index.js";
import { AuthError, ValidationError } from "@packages/error-handler/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setcookies.js";

//user registration
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRegisterationData(req.body, "user");
  const { name, email, password, phone_number, country } = req.body;
  //
  try {
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(new ValidationError("User Already exists with this email"));
    }
    //send otp user
    await checkOtpRestriction(email, next);
    await trackOptRequests(email, next);
    await sendOtp(name, email, "User Mail Activation", "user-activation-mail");
    res.status(201).json({
      message: "OTP send to mail please verify",
      name,
      email,
      password,
      phone_number,
      country,
    });
  } catch (error) {
    console.log("Error while registration : ", error);
    return res.status(500).json({ message: "Error while registration." });
  }
};
//verify user
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name } = req.body;
    if (!email || !otp || !password || !name) {
      return next(new ValidationError("All fields are required"));
    }
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ValidationError("User Already exists with this email"));
    }
    await verifyOTP(email, otp, next);
    const hasherPassword = await bcrypt.hash(password, 10);
    //create user
    await prisma.users.create({
      data: { name, email, password: hasherPassword },
    });
    return res
      .status(201)
      .json({ message: "User created successfull", success: true });
  } catch (error) {
    console.log("verify-user error : ", error);
    return res
      .status(500)
      .json({ message: `Error while verify-user ${error}`, success: false });
  }
};
//login user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError("All fields are required"));
    }
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return next(new AuthError("User not found"));
    }
    //check password
    const checkUser = await bcrypt.compare(password, user.password!);
    if (!checkUser) {
      return next(new AuthError("Invalid creadentials"));
    }
    //generate and access token
    const refreshToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.REFRESH_TOKEN_JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    const accessToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.ACCESS_TOKEN_JWT_SECRET as string,
      { expiresIn: "15m" }
    );
    //store refresh and access token in an httpOnly secure cookie
    setCookie(res, "refresh-token", refreshToken);
    setCookie(res, "access-token", accessToken);
    return res.status(200).json({
      message: "User Login SuccessFully",
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.log("Login error : ", error);
    return res
      .status(500)
      .json({ message: `Error while Login ${error}`, success: false });
  }
};
//Forgot user password
export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const{password,newPassword,confirmPassword}=req.body
  await handleForgetPassword(req, res, next, "user");
};
//verfiy forgot password OTP
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await verifyForgotPasswordOTP(req, res, next);
};
//reset user password
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return next(new ValidationError("All field are required."));
    }
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return next(new AuthError("User not found"));
    }
    //compare new password with exisiting one
    const isSamePassword = await bcrypt.compare(newPassword, user.password!);
    if (isSamePassword) {
      return next(new ValidationError("New password cannot been old one."));
    }
    //modiify password
    const hashedPass = await bcrypt.hash(newPassword, 10);
    //now update user password
    await prisma.users.update({
      where: { email },
      data: { password: hashedPass },
    });
    res.status(200).json({ message: "Password recieved sucessFully" });
  } catch (error) {
    console.log("reset password error : ", error);
    return res
      .status(500)
      .json({ message: `Error while reset password ${error}`, success: false });
  }
};
