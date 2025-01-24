// Description: The main server file for the backend. It is responsible for setting up the server and connecting to the database. It also sets up the routes for the backend API.
import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongodb.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary"; 
import cors from "cors";

// import the routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";


const app = express();


dotenv.config();

app.use(cors());

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// const PORT = process.env.PORT || 6002;
const PORT = 6002;

// middleware runs between req and res
app.use(express.json()); // the middleware for parsing req.body in json format

app.use(express.urlencoded({ extended: true })); // the middleware for parsing req.body in urlencoded format

app.use(cookieParser()); // the middleware for parsing cookies




// routes
app.use("/api/auth",authRoutes); // API for the authentication page
app.use("/api/user", userRoutes); // API for the user operations
app.use("/api/post", postRoutes); // API for the post operations
app.use("/api/notification", notificationRoutes); // API for the notification operations



// API for the post operations
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});
