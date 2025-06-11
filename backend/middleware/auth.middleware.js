import jwt from 'jsonwebtoken'; 
import User from '../model/user.model.js'
export const protectRoute = async(req, res, next) => {

    try {
        
        const accessToken =req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        // Verify the access token

        try{
        const decoded = jwt.verify(accessToken, process.env.REFRESH_TOKEN_SECRET);

        const user= await User.findById(decoded.userId).select("-password");;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;


        next();
    } catch (error) {
        if(error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired" });
    }
        throw error; 
}
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}