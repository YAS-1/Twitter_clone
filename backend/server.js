// Description: The main server file for the backend. It is responsible for setting up the server and connecting to the database. It also sets up the routes for the backend API.
import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongodb.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary"; 

// import the routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";


dotenv.config();

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const port = process.env.PORT || 8000;


const app = express();



// middleware runs between req and res
app.use(express.json()); // the middleware for parsing req.body in json format

app.use(express.urlencoded({ extended: true })); // the middleware for parsing req.body in urlencoded format

app.use(cookieParser()); // the middleware for parsing cookies




// routes
app.use("/api/auth",authRoutes); // API for the authentication page
app.use("/api/user", userRoutes); // API for the user operations
app.use("/api/post", postRoutes); // API for the post operations



// API for the post operations
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectMongoDB();
});
