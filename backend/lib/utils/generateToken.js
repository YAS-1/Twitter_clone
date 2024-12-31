
import jwt from "jsonwebtoken"; // library for creating JWTs

export const generateTokenAndSetCookie = (userId, res) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, { // the sign function takes in 3 parameters ie; payload, secret--> which is a secret key, options
        expiresIn: '15d',
    })

    res.cookie( "jwt", token,{ // the cookie function takes in 3 parameters ie; name of the cookie, value--> what the cookie holds, options
        maxAge: 15*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    })
}