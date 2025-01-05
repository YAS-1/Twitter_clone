import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const protectRoute = async (req, res, next) => {
    try{
            const token = req.cookies.jwt; // The token is stored in the cookie
            if (!token){
                return res.status(401).json({error: "Unauthorized: No token provided"}); // If the token is not present: Unauthorized
            }

            const decode = jwt.verify(token, process.env.JWT_SECRET); // Verifying the token
            if (!decode){
                return res.status(401).json({error: "Unauthorized: Invalid token"}); // If the token is invalid: Unauthorized
            }

            const user = await User.findById(decode.userId).select("-password"); // The user is found by their id and the password is excluded from the response    
            if (!user){
                return res.status(404).json({error: "User not found"}); // If the user is not found
            }

            req.user = user; // The user is stored in the request object
            next(); // The next middleware is called 
    }
    catch(error){
        console.log(`Error in protectRoute middleware: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}