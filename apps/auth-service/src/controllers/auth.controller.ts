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
// import prisma from "../../../../packages/libs/prisma/index.js";
import { AuthError, ValidationError } from "@packages/error-handler/index.js";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setcookies.js";
import { users } from "@packages/generated/prisma/client.js";
import prisma from "@packages/libs/prisma/index.js";

interface AuthRequest extends Request {
  user?: users | null;
}

//user registration
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("req.body.data : ", req.body);
  validateRegisterationData(req.body, "user");
  const { name, email, password, phone_number, country } = req.body;
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
    console.log("Req.body : ", req);
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
//getUser
export const getUserProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return new AuthError("User not found.");
    }
    return res.status(200).json({ message: "User get successFully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error while get user profile" });
  }
};
//refresh -> refreshtoken
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return new ValidationError("Unauthorized No refresh Token");
    }
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_JWT_SECRET as string
    ) as { id: string; role: string };
    if (!decodedToken || !decodedToken.id || !decodedToken.role) {
      return new JsonWebTokenError("ForBidden Inavlid Refresh Token");
    }
    const user = await prisma.users.findUnique({
      where: { id: decodedToken.id },
    });
    if (!user) {
      return new AuthError("User/Seller not found");
    }
    //generate new access token
    const newAccessToken = jwt.sign(
      { id: decodedToken.id, role: decodedToken.role },
      process.env.ACCESS_TOKEN_JWT_SECRET as string,
      { expiresIn: "15m" }
    );
    setCookie(res, "access-token", newAccessToken);
    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
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
  console.log("verifyForgotPasswordOTP ", req);
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
//--------------Seller-----------------------
export const registerSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email } = req.body;
    validateRegisterationData(req.body, "seller");
    //after clear validaton
    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });
    if (existingSeller) {
      throw new ValidationError("Seller already exist with this email.");
    }
    await checkOtpRestriction(email, next);
    await trackOptRequests(email, next);
    await sendOtp(
      name,
      email,
      "Seller Activation OTP mail",
      "seller-activation"
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "OTP send to your mail please verify your account",
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error while register seller" });
  }
};
//verify seller otp
export const verifySellerOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, otp, phone_number, country } = req.body;
    if (!name || !email || !password || !otp || !phone_number || !country) {
      return next(new ValidationError("All fields are required"));
    }
    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });
    if (existingSeller) {
      throw new ValidationError("Seller already exist with this email.");
    }
    //verify otp
    await verifyOTP(email, otp, next);
    const hasherPassword = await bcrypt.hash(password, 10);
    //create user
    const seller = await prisma.sellers.create({
      data: { name, email, password: hasherPassword, phone_number, country },
    });
    return res
      .status(201)
      .json({ message: "Seller created successfull", success: true, seller });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error while verify seller otp." });
  }
};
export const createNewShop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, bio, category, address, opening_hours, website, sellerId } =
      req.body;
    if (
      !name ||
      !bio||
      !category ||
      !address ||
      !opening_hours ||
      !website ||
      !sellerId
    ) {
      return next(new ValidationError("All fields are required"));
    }
    const shopData:any = {
      name,
      bio,
      category,
      address,
      opening_hours,
      website ,
      sellerId
    }
    if(website && website.trim()!==""){
      shopData.website=website
    }
    const shop = await prisma.shops.create({data:shopData})
    return res.status(201).json({message:"Shop created successfully",success:true,shop})
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error while create shop." });
  }
};
