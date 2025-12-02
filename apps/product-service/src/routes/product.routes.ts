import express, { Router } from "express"
import { createDiscountCode, createProduct, deleteDiscountCode, deleteProduct, deleteProductImage, findShopProducts, getDiscountCode, getProductCategories, restoreProduct, uploadProductImage } from "../controllers/product.controller.js"
import { isSeller, sellerAuthMiddleware } from "@packages/middleware/isAuth.middleware.js"
const router:Router = express.Router()
router.get("/categories",getProductCategories)
router.post("/create-discount-code",sellerAuthMiddleware,isSeller,createDiscountCode)
router.get("/find-discount-codes",sellerAuthMiddleware,isSeller,getDiscountCode)
router.post("/delete-discount-code/:id",sellerAuthMiddleware,isSeller,deleteDiscountCode)
//upload file
router.post("/upload-image",sellerAuthMiddleware,isSeller,uploadProductImage)
router.post("/delete-image",sellerAuthMiddleware,isSeller,deleteProductImage)
//product routes
router.post("/create-product",sellerAuthMiddleware,isSeller,createProduct)
router.get("/get-shop-products",sellerAuthMiddleware,isSeller,findShopProducts)
router.delete("/delete-product/:id",sellerAuthMiddleware,isSeller,deleteProduct)
router.put("/restore-product/:id",sellerAuthMiddleware,isSeller,restoreProduct)

export default router