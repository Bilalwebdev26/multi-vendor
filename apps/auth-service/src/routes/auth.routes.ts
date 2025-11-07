import express, { Router } from "express";
import { userRegistration } from "../controllers/auth.controller.js";
// import { userRegistration } from "../controllers/auth.controller";
// userRegistration
const router:Router = express.Router()

router.post("/register-user",userRegistration)

export default router