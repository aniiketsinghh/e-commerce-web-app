import Coupon from "../model/coupon.model.js";
export const getCoupon=async (req, res) => {
    try {
        const coupon= await Coupon.find({userId: req.user._id, isActive: true});
        res.json(coupon|| null);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const validateCoupon=async (req, res) => {
    try {
        const {code}= req.body;
        const coupon= await Coupon.findOne({code: code,userId:req.user._id ,isActive: true});
        if(!coupon){
            return res.status(404).json({ message: "Coupon not found" });
        }
        if(coupon.expirationDate < new Date()){
        coupon.isActive=false;
        await coupon.save();
        return res.status(400).json({ message: "Coupon has expired" });
        }else{
            return res.status(200).json({ message: "Coupon is valid" });
        }

        res.json({
            message: "Coupon validated successfully",
            code:coupon.code,
            discontPercentage:coupon.discountPercentage
        })
    } catch (error) {
        console.error("Error validating coupon:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}