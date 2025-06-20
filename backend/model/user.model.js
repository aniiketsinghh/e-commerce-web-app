import mongoose from "mongoose"
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    cartItems: [{
    quantity:{
        type: Number,
        default: 1
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
    }],
   role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },  
},{timestamps:true}
)


userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            return next(error);
        }
    }
})

userSchema.methods.comparePassword = function(password) {
    try {
        return  bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
}

const User = mongoose.model('User', userSchema);
export default User;