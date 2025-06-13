import express from 'express';
const router = express.Router();
import { protectRoute,adminRoute} from '../middleware/auth.middleware.js';
import { getAllProductsController,
    getFeaturedProducts,
    toggleFeaturedProduct,
    getProductsByCategory,
    createProduct,
    deleteProduct,
    getRecommendedProducts
}
     from '../controllers/product.controller.js';

router.get("/", protectRoute,adminRoute,getAllProductsController);
router.get("/featured",getFeaturedProducts);
router.get("/category/:category",getProductsByCategory);
router.get("/recommendation",getRecommendedProducts);
router.post("/", protectRoute,adminRoute,createProduct);
router.patch("/:id", protectRoute,adminRoute,toggleFeaturedProduct);
router.delete("/:id", protectRoute,adminRoute,deleteProduct);


export default router;