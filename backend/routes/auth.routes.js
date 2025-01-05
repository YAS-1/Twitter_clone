
import express from "express";
import { signup, login, logout } from "../controllers/auth.controllers.js";


const authRoutes = express.Router();


authRoutes.post("/signup", signup); // The signup endpoint, which is a POST request that takes two parameters ie the path (/signup) and the request handler function(signup - imported from the auth.controllers.js file)


authRoutes.post("/login", login); // The login endpoint, which is a POST request that takes two parameters ie the path (/login) and the request handler function(login - imported from the auth.controllers.js file)


authRoutes.post("/logout", logout); // The logout endpoint, which is a POST request that takes two parameters ie the path (/logout) and the request handler function(logout - imported from the auth.controllers.js file)


export default authRoutes;