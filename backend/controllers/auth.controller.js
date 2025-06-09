import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
})
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });

    
}
export const SignUpController = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.find({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user= await User.create({
            name,
            email,
            password
        });

        generateToken(user._id)

        return res.status(201).json({ user, message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error in signup" });
    }
}

export const LoginController = async (req, res) => {}

export const LogoutController = async (req, res) => {}