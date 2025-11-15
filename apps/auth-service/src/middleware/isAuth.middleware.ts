import { AuthError } from "@packages/error-handler";
import { sellers, users } from "@packages/generated/prisma/client";
import prisma from "@packages/libs/prisma";
// import prisma from "@packages/libs/prisma";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface AuthRequest extends Request {
  user?: users | null;
  userRole?: string
}
interface SellerAuthRequest extends Request {
  seller?: sellers | null;
  sellerRole?: string
}
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.["access-token"] || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_JWT_SECRET as string
    ) as { id: string; role: "user" };
    if (!decodedToken || !decodedToken.id || !decodedToken.role) {
      return res
        .status(401)
        .json({ message: "ForBidden Inavlid Refresh Token" });
    }
    const user = await prisma.users.findUnique({
      where: { id: decodedToken.id },
    });
    if(!user){
        return res
        .status(401)
        .json({ message: "Seller account not found." });
    }
    req.user = user;
    req.userRole = decodedToken.role
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized Token exired or invalid" });
  }
};
export const sellerAuthMiddleware = async (
  req: SellerAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.["seller-access-token"] ||
      req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_JWT_SECRET as string
    ) as { id: string; role: "seller" };
    if (!decodedToken || !decodedToken.id || !decodedToken.role) {
      return res
        .status(401)
        .json({ message: "ForBidden Inavlid Refresh Token" });
    }
    const seller = await prisma.sellers.findUnique({
      where: { id: decodedToken.id },
      include: { shop: true },
    });
    if(!seller){
        return res
        .status(401)
        .json({ message: "Seller account not found." });
    }
    req.seller = seller;
    req.sellerRole = decodedToken.role
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized Token exired or invalid" });
  }
};
export const isSeller = (req:SellerAuthRequest,res:Response,next:NextFunction)=>{
  if(req.sellerRole !== "seller"){
    return next(new AuthError("Only Seller route"))
  }
  next()
}
export const isUser = (req:AuthRequest,res:Response,next:NextFunction)=>{
  if(req.userRole !== "user"){
    return next(new AuthError("Only user route"))
  }
  next()
}