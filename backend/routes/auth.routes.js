
import express from "express";
import { signup, login, logout } from "../controllers/auth.controllers.js";


const authRoutes = express.Router();


authRoutes.post("/signup", signup);


authRoutes.get("/login", login);


authRoutes.get("/logout", logout);


export default authRoutes;