import express from 'express';
const router = express.Router();
import { protectRoute,adminRoute} from '../middleware/auth.middleware.js';
import { getAllProductsController ,getFeaturedProducts,createProduct} from '../controllers/product.controller.js';

router.get("/", protectRoute,adminRoute,getAllProductsController);
router.get("/featured",getFeaturedProducts);
router.post("/", protectRoute,adminRoute,createProduct);


export default router;