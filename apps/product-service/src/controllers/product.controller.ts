import { ValidationError } from "@packages/error-handler/index.js";
import { prisma } from "../../../../lib/prisma.js";
import { NextFunction, Response, Request } from "express";
import { imageKit } from "@packages/libs/imageKit/index.js";
import { sendValidationError } from "../helper/product.helper.js";

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
  console.log("public_name : ", public_name);
  console.log("discountType : ", discountType);
  console.log("discountValue : ", discountValue);
  console.log("discountCode : ", discountCode);
  console.log("req.seller.id : ", req.seller.id);
  console.log(typeof req.seller.id);
  try {
    //check discount exist or not
    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: { discountCode },
    });
    console.log("isDiscountCodeExist : ", isDiscountCodeExist);
    if (isDiscountCodeExist) {
      return next(new ValidationError("Discount Code Already available"));
    }
    const newDiscountCode = await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue: Number(discountValue),
        discountCode,
        sellerId: req.seller.id,
      },
    });
    console.log("newDiscountCode : ", newDiscountCode);
    return res
      .status(201)
      .json({ message: "Discount Code Created SuccessFully", newDiscountCode });
  } catch (error: any) {
    console.log("🔥 Prisma FULL ERROR >>>>", error);
    console.log("🔥 Prisma ERROR MESSAGE >>>>", error.message);
    console.log("🔥 Prisma ERROR META >>>>", error.meta);
    console.log("🔥 Prisma ERROR CAUSE >>>>", error.cause);
    return res.status(500).json({
      message: "Server Error! while generating discount code.",
      error,
      meta: error.meta,
      cause: error.cause,
    });
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
      where: { sellerId: req.seller.id },
    });
    if (!discountCodeExist) {
      return next(new ValidationError("Discount Code Not Exist."));
    }
    return res
      .status(201)
      .json({ message: "Discount Code Found SuccessFully", discountCodeExist });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error! while finding discount code." });
  }
};
export const deleteDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  //   const { discountCode } = req.body;
  const id = req.params.id; //-> discount code id
  const sellerId = req.seller?.id;
  try {
    //check discount exist or not
    const discountCode = await prisma.discount_codes.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });
    if (!discountCode) {
      return next(new ValidationError("Discount Code Not available"));
    }
    if (discountCode.sellerId !== sellerId)
      return next(
        new ValidationError(
          "You're not authorized to delete this discount code."
        )
      );
    await prisma.discount_codes.delete({ where: { id } });
    return res
      .status(201)
      .json({ message: "Discount Code Deleted SuccessFully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error! while deleting discount code." });
  }
};
export const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { base64Image } = req.body;
  console.log("Base64Image : ", base64Image);
  if (!base64Image) {
    return res.status(500).json({ message: "Upload Image is required." });
  }
  console.log("Controller : ");
  try {
    const file = await imageKit.upload({
      file: base64Image,
      fileName: `product-${Date.now()}.jpg`,
      folder: "/products",
    });
    return res.status(201).json({
      file_url: file.url,
      fileName: file.fileId,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error! while Upload Image.", error });
  }
};
export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fileId } = req.body;
  if (!fileId) {
    return res.status(500).json({ message: "fileId  is required." });
  }
  try {
    const deleteFile = await imageKit.deleteFile(fileId, (error, response) => {
      if (error) {
        console.log("Error while image delete : ", error);
        return;
      } else {
        console.log("Res after delete image : ", response);
      }
      return res.status(201).json({
        success: true,
        deleteFile,
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error! while delete Image.", error });
  }
};

export const createProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      detailed_description,
      warranty,
      tags,
      slug,
      brand,
      cash_on_delivery,
      categories,
      subCategory,
      video_url,
      regular_price,
      sale_price,
      stock,
      colors = [],
      sizes = [],
      customProperties = {},
      custom_specification,
      discountCode,
      images = [],
    } = req.body.data;
    console.log("Title : ", title);
    //sendValidationError(req, res);
    if (!req.seller.id) {
      return next(new ValidationError("Only Seller can create product."));
    }
    const slugChecking = await prisma.products.findUnique({ where: { slug } });
    if (slugChecking) {
      return next(
        new ValidationError("Slug Already Exist! Please use a different slug!")
      );
    }
    const newProduct = await prisma.products.create({
      data: {
        title,
        description,
        detailed_description,
        warranty,
        tags: Array.isArray(tags) ? tags : tags.split(","),
        slug,
        brand,
        cash_on_delivery: cash_on_delivery === "true" ? true : false,
        categories,
        subCategory,
        video_url,
        regular_price: parseFloat(regular_price),
        sale_price: parseFloat(sale_price),
        stock: parseInt(stock),
        colors: colors || [],
        sizes: sizes || [],
        customProperties: customProperties || {},
        custom_specification: custom_specification || {},
        discountCode: discountCode.map((codeId: string) => codeId),
        images: {
          create: images
            .filter((img: any) => img && img.fileName && img.file_url)
            .map((img: any) => ({
              file_id: img.fileName,
              url: img.file_url,
            })),
        },
        shopId: req.seller?.shop?.id,
      },
      include: { images: true },
    });
    return res.status(201).json({
      success: true,
      newProduct,
      message: "Product created successfully.",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server Error! while create product.",
      error: JSON.parse(JSON.stringify(error)), // ⭐ FULL ERROR
      stack: error.stack, // ⭐ STACK TRACE
      meta: error.meta || null, // null if undefined
      cause: error.cause || null,
    });
  }
};
export const findShopProducts = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.seller.id) {
      return next(new ValidationError("Only Seller can access product."));
    }
    const products = await prisma.products.findMany({
      where:{
        shopId:req.seller?.shop?.id
      },
      include:{
        images:true
      }
    });
    return res.status(201).json({
      success: true,
      products,
      message: "Product founds successfully.",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server Error! while found products.",
      error: JSON.parse(JSON.stringify(error)), // ⭐ FULL ERROR
      stack: error.stack, // ⭐ STACK TRACE
      meta: error.meta || null, // null if undefined
      cause: error.cause || null,
    });
  }
};
