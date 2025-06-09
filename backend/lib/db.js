import mongoose from "mongoose"

const connectDB= async ()=>{
    try{
    const conn=await mongoose.connect(process.env.MONGO_URI)
    console.log(`MONGODB connected at ${conn.connection.host}`)
}   catch(error) {
    console.log("error in mongo db connection :" ,error.message);
    process.exit(1);
}}

export default connectDB;