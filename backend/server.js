import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongodb.js";

import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

// middleware runs between req and res
app.use(express.json()); // the middleware for parsing req.body in json format
app.use(express.urlencoded({ extended: true })); // the middleware for parsing req.body in urlencoded format

app.use(cookieParser()); // the middleware for parsing cookies

app.use("/api/auth",authRoutes); // API for the authentication page

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectMongoDB();
});
