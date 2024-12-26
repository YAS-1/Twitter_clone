import mongoose from "mongoose";

// Using mongoose to connect to the created Mongodb 
const connectMongoDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch(error){
        console.error(`Error connecting: ${error.message}`);
        process.exit(1); // 1 signals that something went wrong
    }
}

export default connectMongoDB;