import { NextFunction, Response, Request } from "express";
export const sendValidationError = (req:any,res:Response) => {
  // ------------------- VALIDATION -------------------

  const errors = [];

  // Required string fields
  if (!req.body.title) errors.push("Title is required");
  if (!req.body.description) errors.push("Description is required");
  if (!req.body.detailed_description)
    errors.push("Detailed description is required");
  if (!req.body.slug) errors.push("Slug is required");
  if (!req.body.brand) errors.push("Brand is required");
  if (!req.body.categories) errors.push("Category is required");
  if (!req.body.subCategory) errors.push("Subcategory is required");

  // Required numbers
  if (req.body.regular_price == null) errors.push("Regular price is required");
  if (req.body.sale_price == null) errors.push("Sale price is required");
  if (req.body.stock == null) errors.push("Stock is required");

  // Type validations
  if (req.body.regular_price && isNaN(req.body.regular_price))
    errors.push("Regular price must be a number");

  if (req.body.sale_price && isNaN(req.body.sale_price))
    errors.push("Sale price must be a number");

  if (req.body.stock && isNaN(req.body.stock))
    errors.push("Stock must be a number");

  // Arrays validations
  if (!Array.isArray(req.body.colors || []))
    errors.push("Colors must be an array");

  if (!Array.isArray(req.body.sizes || []))
    errors.push("Sizes must be an array");

  if (req.body.discountCode && !Array.isArray(req.body.discountCode))
    errors.push("Discount code must be an array");

  if (!Array.isArray(req.body.images || []))
    errors.push("Images must be an array");

  // Custom properties
  if (
    req.body.customProperties &&
    typeof req.body.customProperties !== "object"
  )
    errors.push("Custom properties must be an object");

  // Minimum 1 image required
  if (!req.body.images || req.body.images.length === 0)
    errors.push("At least 1 image is required");

  // If validation fails
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }
};
