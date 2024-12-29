
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; // For encrypting passwords

// function for the signup endpoint
export const signup = async (req, res) =>{
    try{
        const { fullname, username, email, password} = req.body; // The user is going to provide their details in the body

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex to set the format of the email

        if (!emailRegex.test(email)){ // The emailRegex is used to check if the entered email is valid
            return res.status(400).json({ error: "Invalid email format"});
        }

        // Checking if the entered username already exists in the system
        const existingUser = await User.findOne({username});
        if (existingUser){
            return res.status(400).json({ error: "Username already exists"});
        }

        // Checking if the email already exists in the system
        const existingEmail = await User.findOne({email});
        if (existingEmail){
            return res.status(400).json({ error: "Email already exists"});
        }

        // Hashing / encrypting password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    }
    catch(error){

    }
};


// function for the login endpoint
export const login = async (req, res) => {
    res.json({
        message: 'Login route working',
    });
};


// function for the logout endpoint
export const logout = async (req, res) => {
    res.json({
        message: 'Logout route working',
    });
};