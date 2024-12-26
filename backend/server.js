import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongodb.js";

import authRoutes from "./routes/auth.routes.js";


dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.use("/api/auth",authRoutes); // API for the authentication page

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectMongoDB();
});
