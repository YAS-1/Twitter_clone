import mongoose from "mongoose";

//creating a userSchema / model
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    fullname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[],
        } // The followers array will contain user Ids all the people following that particular user
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[],
        },
    ],
    profileImage:{
        type:String,
        default:"",
    },
    coverImage:{
        type:String,
        default:"",
    },
    bio:{
        type:String,
        default:"",
    },
    link:{
        type:String,
        default:"",
    },
    likedPost:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Post",
        }
    ],

}, {timestamps: true});


const User = mongoose.model("User", userSchema); // Creating the User model / collection using the attributes created in userSchema

export default User;