import { ValidationError } from "@packages/error-handler/index.js";
import { prisma } from "../../../../lib/prisma.js";
import { NextFunction, Response, Request } from "express";

//get product category
export const getProductCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.side_config.findFirst();
    if (!categories) {
      return res.status(400).json({ message: "No Categoies found" });
    }
    return res
      .status(200)
      .json({ message: "Categories data fetched", categories });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error ! No Categoies found" });
  }
};
export const createDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { public_name, discountType, discountValue, discountCode } = req.body;
  try {
    //check discount exist or not
    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: { discountCode },
    });
    if (isDiscountCodeExist) {
      return next(new ValidationError("Discount Code Already available"));
    }
    const newDiscountCode = await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue,
        discountCode,
        sellerId: req.seller.id,
      },
    });
    return res
      .status(201)
      .json({ message: "Discount Code Created SuccessFully", newDiscountCode });
  } catch (error) {
    return res.status(500).json({message:"Server Error! while generating discount code."})
  }
};
export const getDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    //check discount codes exist or not
    const discountCodeExist = await prisma.discount_codes.findMany({
      where: { sellerId:req.seller.id },
    });
    if (!discountCodeExist) {
      return next(new ValidationError("Discount Code Not Exist."));
    }
    return res
      .status(201)
      .json({ message: "Discount Code Found SuccessFully", discountCodeExist });
  } catch (error) {
    return res.status(500).json({message:"Server Error! while finding discount code."})
  }
};
export const deleteDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
//   const { discountCode } = req.body;
  const id = req.params //-> discount code id
  const sellerId = req.seller?.id
  try {
    //check discount exist or not
    const discountCode = await prisma.discount_codes.findUnique({
      where: { id },select:{id:true,sellerId:true}
    });
    if (!discountCode) {
      return next(new ValidationError("Discount Code Not available"));
    }
    if(discountCode.sellerId!==sellerId) return next(new ValidationError("You're not authorized to delete this discount code."));
    await prisma.discount_codes.delete({where:{id}})
    return res
      .status(201)
      .json({ message: "Discount Code Deleted SuccessFully" });
  } catch (error) {
    return res.status(500).json({message:"Server Error! while deleting discount code."})
  }
};
