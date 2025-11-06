import { AppError } from "./index";
import type {Request,Response} from "express"
export const errorMiddleare = (err: Error, req: Request, res: Response) => {
  if (err instanceof AppError) {
    console.log(`Error ${req.method} ${req.url} - ${err.message}`);
    return res
      .status(err.statusCode)
      .json({ status: "error", message: err.message, ...(err.details && {details:err.details}) });
  }
  console.log("Unhandled Error")
  return res.status(500).json({message:"Something went wrong,please try again later."})
};
