import { NextFunction, Request, Response } from "express";
import { checkOtpRestriction, sendOtp, trackOptRequests, validateRegisterationData } from "../utils/auth.helper";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";
export const userRegistration = async (req: Request, res: Response,next:NextFunction) => {
    validateRegisterationData(req.body,"user");
    const{name,email,password,phone_number,country} = req.body;
    try {
        const existingUser = await prisma.users.findUnique({
            where:email
        })
        if(existingUser){
            return next(new ValidationError("User Already exists with this email"))
        }
        //send otp user
        await checkOtpRestriction(email,next)
        await trackOptRequests(email,next)
        await sendOtp(name,email,"user-activation-mail")
        res.status(201).json({message:"OTP send to mail please verify"})
    } catch (error) {
        console.log("Error while registration : ",error)
        return res.status(500).json({message:"Error while registration."})
    }
}