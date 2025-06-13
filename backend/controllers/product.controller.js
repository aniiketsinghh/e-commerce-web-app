import Product from '../model/product.model.js';
import {redis} from '../lib/redis.js';
import cloudinary from "../lib/cloudinary.js"
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
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image,category} = req.body;
        let cloudinaryImage = null;
        // Check if image is provided
        if (image) {
           cloudinaryImage= await cloudinary.uploader.upload(image, { folder: "products" })
                
        }
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryImage?.secure_url ? cloudinaryImage.secure_url : "",
            category,
        });
        res.status(201).json({ message: "Product created successfully", product });
            
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Delete image from cloudinary if it exists
        if (product.image) {
            const imageId = product.image.split("/").pop().split(".")[0];
            try {
             await cloudinary.uploader.destroy(`products/${imageId}`);
             console.log("Image deleted successfully from Cloudinary");
            } catch (error) {
                console.error("Error extracting image ID:", error);
                return res.status(500).json({ message: "Internal server error" });
                
            }
        }
        // Delete product from database
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 } 
            },
            {
               $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    image: 1,    
            }
        }
        ]);
        res.json(products);
    } catch (error) {
        console.error("Error fetching recommended products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({category});
        res.json(products);

    } catch (error) {
        console.error("Error fetching products by category:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    // try {
        
    // } catch (error) {
    //     console.error("Error toggling featured product:", error);
    //     return res.status(500).json({ message: "Internal server error" }); 
    // }
}