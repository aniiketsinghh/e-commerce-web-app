import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import {redis} from "../lib/redis.js";

//for creating tokens
const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
})
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });

    return { accessToken, refreshToken };
}

//storing token in redis database upstash
const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refreshToken:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7 days expiration

}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {

        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // 
        sameSite: "strict", // 
        maxAge: 15 * 60 * 1000 
    });

     res.cookie("refreshToken", refreshToken, {

        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // 
        sameSite: "strict", // 
        maxAge: 7* 24 *60* 60 * 1000
    });
}

export const SignUpController = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user= await User.create({
            name,
            email,
            password
        });

      const { accessToken, refreshToken } = generateToken(user._id)
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);
        
        return res.status(201).json({ user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
        }
            , message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error in signup" });
    }
}

export const LoginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user= await User.findOne({email});

        if (user && (await user.comparePassword(password))) {
          const { accessToken, refreshToken } = generateToken(user._id);
          await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

            });
          }  else{
            return res.status(401).json({ message: "Invalid email or password" });
          }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error during login" });
        
    }
}

export const LogoutController = async (req, res) => {
    try{
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken) {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`refreshToken:${decoded.userId}`); // Remove the refresh token from Redis
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out successfully" });
}catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal server error during logout" });
    }
}

export const RefreshTokenController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found" });
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedRefreshToken = await redis.get(`refreshToken:${decoded.userId}`);

        if(storedRefreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token provided" });
        }
        const accessToken = jwt.sign({ userId: decoded.userId }, 
            process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m"
            });

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000 // 15 minutes
            });
            return res.status(200).json({ message: "Token refreshed successfully" });
    } catch (error) {
        console.error("Error during token refresh:", error);
        return res.status(500).json({ message: "Internal server error during token refresh" });
    }
}