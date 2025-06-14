import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
const router=express.Router()
import {getCoupon,validateCoupon} from "../controllers/coupon.controller.js"

router.get("/",protectRoute,getCoupon)
router.get("/validate",protectRoute,validateCoupon)


validateCoupon

export default router