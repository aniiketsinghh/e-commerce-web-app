import Product from '../model/product.model.js';
import redis from '../config/redis.js';
export const getAllProductsController = async (req, res) => {

    try {
        
        const products = await Product.find({});
        return res.status(200).json({products});


    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        //if feature products stored in cache, means in redis, then return it
        let featuredProducts=await redis.get("featured_products");
        if(!featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }
        //if not, then fetch from database

        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if(!featuredProducts || featuredProducts.length === 0) {
            return res.status(404).json({ message: "No featured products found" });
        }

        //store in redis for future quick access
        await redis.set("featured_products", JSON.stringify(featuredProducts)), 

        res.json(featuredProducts);
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}
export const createProduct = async (req, res) => {}