import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB atlas is connected now");
    }
    catch (error){
        console.error("problem database error");
    }
};

export default connectDB;