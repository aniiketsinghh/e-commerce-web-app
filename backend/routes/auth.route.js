import express from 'express';
const router = express.Router();
import { SignUpController,LoginController,LogoutController } from '../controllers/auth.controller.js';

router.post("/signup", SignUpController);
router.post("/login", LoginController);
router.post("/logout", LogoutController);


export default router;


