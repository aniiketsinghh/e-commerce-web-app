import express from 'express';
const router = express.Router();
import { SignUpController,LoginController,LogoutController } from '../controllers/auth.controller.js';

router.post("/signup", SignUpController);
router.post("/login", LoginController);
router.post("/logout", LogoutController);


export default router;


mongodb+srv://aniketsingh2004ak:LVbesLiGRdOZVfuP@cluster0.xne2918.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0