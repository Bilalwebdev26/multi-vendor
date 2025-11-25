import express, { Router } from "express"
import { createDiscountCode, deleteDiscountCode, getDiscountCode, getProductCategories } from "../controllers/product.controller.js"
import { isSeller, sellerAuthMiddleware } from "@packages/middleware/isAuth.middleware.js"
const router:Router = express.Router()
router.get("/categories",getProductCategories)
router.post("/create-discount-code",sellerAuthMiddleware,isSeller,createDiscountCode)
router.get("/find-discount-codes",sellerAuthMiddleware,isSeller,getDiscountCode)
router.post("/delete-discount-code",sellerAuthMiddleware,isSeller,deleteDiscountCode)
export default router