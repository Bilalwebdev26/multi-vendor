import { users } from "@packages/generated/prisma/client";
import prisma from "@packages/libs/prisma";
// import prisma from "@packages/libs/prisma";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface AuthRequest extends Request {
  user?: users | null;
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
  ) as { id: string; role: "user"|"seller" };
  if (!decodedToken || !decodedToken.id || !decodedToken.role) {
    return res.status(401).json({message:"ForBidden Inavlid Refresh Token"});
  }
   const user = await prisma.users.findUnique({ where: { id: decodedToken.id } });
   req.user = user
   return next()
  } catch (error) {
    return res.status(401).json({message:"Unauthorized Token exired or invalid"})
  }
};
