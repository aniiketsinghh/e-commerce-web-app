import express from 'express';
const router = express.Router();
import { getAllProductsController } from '../controllers/product.controller.js';

router.get("/",getAllProductsController);

export default router;