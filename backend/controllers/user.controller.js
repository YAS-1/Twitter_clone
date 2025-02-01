import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Notification from "../models/notifications.js";


// function for the getUserProfile endpoint
export const getUserProfile = async (req, res) => {
    try{
        const { username } = req.params; // get the username from the request parameters
        const user = await User.findOne({ username}).select("-password"); // find the user with the username and exclude the password field

        if (!user){
            return res.status(404).json({error: "User not found"}); // if the user is not found, return a 404 status code and an error message
        }

        res.status(200).json({ user }); // if the user is found, return a 200 status code and the user object
    }
    catch(error){
        console.log(`Error in getUserProfile controller: ${error.message}`);
        res.status(500).json({ error: error.message});
    }
}



// function for the getSuggestedUsers endpoint
export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id; // get the user id from the request object
        const usersFollowedByMe =  await User.findById(userId).select("following"); // find the user by the id and select the following field

        const users = await User.aggregate([ // get 10 random users from the database
            {
                $match:{_id: {$ne:userId}} // excludes the current userId --> filters out the current user $ne = not equal
            },
            { $sample: { size: 10 } } // gets 10 random users
        ]);

        const fliteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id)); // iterates through the users and only retains the ids that are not in the following array of the current user
        const suggestedUsers = fliteredUsers.slice(0, 4); // get the first 5 users from the filtered users

        suggestedUsers.forEach((user) => (user.password = undefined)); // exclude the password field from the suggested users

        res.status(200).json(suggestedUsers); // return a 200 status code and the suggested users
    }
    catch(error){
        console.log(`Error in getSuggestedUsers controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}



// function for the followUnFollowUser endpoint
export const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params; // get the user id from the request parameters
        const userToModify = await User.findById(id); // find the user to modify by the id
        const currentUser = await User.findById(req.user._id); // find the current user by the id

        if ( id === req.user._id.toString() ){
            return res.status(400).json({ error: "You cannot follow/unfollow yourself"}); // if the user tries to follow/unFollow themselves, return a 400 status code and an error message
        }

        if (!userToModify || !currentUser){
            return res.status(404).json({ error: "User not found"}); // if the user to modify or the current user is not found, return a 404 status code and an error message
        }

        const isFollowing = currentUser.following.includes(id); // check if the current user is already following the user to modify

        if( isFollowing ){
            //Unfollow the user
            await User.findByIdAndUpdate(currentUser._id, { $pull: { following: id }}); // remove the user id from the following array of the current user
            await User.findByIdAndUpdate(id, { $pull: { followers:req.user._id }}); // remove the current user id from the followers array of the user to modify
            res.status(200).json({ message: "User unfollowed" });
        }
        else{
            //Follow the user
            await User.findByIdAndUpdate(currentUser._id, { $push: { following: id }}); // add the user id to the following array of the current user
            await User.findByIdAndUpdate(id, { $push:  {followers: req.user._id }}); // add the current user id to the followers array of the user to modify

            // create a notification
            const notification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            });
            await notification.save(); // save the notification to the database

            //TODO: return the id of the user as a response
            res.status(200).json({ message: "User followed" });
        }
    }
    catch(error){
        console.log(`Error in followUnFollowUser controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}


// function for the updateUserProfile endpoint
export const updateUserProfile = async (req, res) => {

    const {fullname, email, username, currentPassword, newPassword, bio, link} = req.body; // get the fullname, email, username, currentPassword, newPassword, bio and link from the request body
    let {profileImage, coverImage} = req.body; // get the profileImage and coverImage from the request body

    const userId = req.user._id; // get the user id from the request object
    try {
        
        let user = User.findById(userId); // find the user by the id
        if(!user){
            return res.status(404).json({ error: "User not found"}); // if the user is not found, return a 404 status code and an error message
        }

        // for updating password
        if((currentPassword && !newPassword) || (newPassword && !currentPassword) ){
            return res.status(400).json({ error: "Please enter both current and new password"}); // if the user enters only one of the current and new password
        }
        if( currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password); // compare the current password with the password in the database

            if(!isMatch){
                return res.status(400).json({ error: "Current password is incorrect"}); // if currentPassword doesn't match the password in the database
            }

            const salt = bcrypt.genSalt(10);
            user.password = await bcrypt.hash( newPassword, salt);
        }

        // for updating the profile image
        if(profileImage){
            if (user.profileImage){
                await cloudinary.uploader.destroy(user.profileImage.split("/").pop().split(".")[0]) // delete the previous profile image from cloudinary           
            }

            const uploadedImage = await cloudinary.uploader.upload(profileImage); // upload the profile image to cloudinary
            profileImage = uploadedImage.secure_url; // set the profile image to the uploaded image url
        }

        // for updating the cover image
        if(coverImage){
            if (coverImage){
                await cloudinary.uploader.destroy(user.coverImage.split("/").pop().split(".")[0]); // delete the previous cover image from cloudinary
            }

            const uploadedImage = await cloudinary.uploader.upload(coverImage); // upload the cover image to cloudinary
            coverImage = uploadedImage.secure_url; // set the cover image to the uploaded image url
        }

        user.fullname = fullname || user.fullname; // set the fullname to the new fullname or the previous fullname
        user.email = email || user.email; // set the email to the new email or the previous email
        user.username = username || user.username; // set the username to the new username or the previous username
        user.bio = bio || user.bio; // set the bio to the new bio or the previous bio
        user.link = link || user.link; // set the link to the new link or the previous link
        user.profileImage = profileImage || user.profileImage; // set the profileImage to the new profileImage or the previous profileImage
        user.coverImage = coverImage || user.coverImage; // set the coverImage to the new coverImage or the previous coverImage

        user.save(); // save the updated user document to the database

        user.password = undefined; // exclude the password field from the user object

        res.status(200).json({user}); // return a 200 status code and a success message
    }
    catch(error){
        console.log(`Error in updateUserProfile controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}
