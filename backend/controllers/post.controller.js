import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notifications.js";

import { v2 as cloudinary } from "cloudinary";


// Create a post 
export const createPost = async (req, res) =>{
    try{
        const { text } = req.body; // get the text from the request body
        let { img } = req.body; // get the img from the request body

        const userId = req.user._id; // get the user id from the request object
        const user = await User.findById(userId); // find the user by id

        if (!user){
            return res.status(404).json({ error: "User not found"});
        }

        if(!text && !img){
            return res.status(400).json({ error: "Please enter text or img"});
        }

        if(img){
            const uploadedimg = await cloudinary.uploader.upload(img);
            img = uploadedimg.secure_url;
        }

        const newPost = Post({
            user: userId,
            text,
            img,
        });

        await newPost.save(); // save the new post
        res.status(200).json(newPost);
    }
    catch(error){
        console.log(`Error in createPost controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}


// Like or unlike a post
export const likeUnlikePost = async (req, res) =>{
    try{
        
        const postId = req.params.id; // get the post id from the request params
        const userId = req.user._id; // get the user id from the request object

        const post = await Post.findById(postId); // find the post by id
        if(!post){
            return res.status(404).json({ error: "Post not found"});
        }

        const LikedPost = post.like.map(id => id.toString()).includes(userId); // check if the user has already liked the post

        if(LikedPost){
            // unlike the post
            await Post.updateOne({_id: postId}, {$pull: {like: userId}});// remove the user id from the like array
            await User.updateOne({_id: userId}, {$pull: {likedPost: postId}}); // remove the postId from the likedPost array on the user end

            const updatedLikes = post.like.filter((id) => id.toString() !== userId.toString());

            return res.status(200).json(updatedLikes);
        }
        else{
            await Post.updateOne({_id: postId}, {$push: {like: userId}}); // add the user id to the like array
            await User.updateOne({_id: userId}, {$push: {likedPost: postId}}); // add the postId to the likedPost array
            

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });

            await notification.save(); // save the notification

            const updatedLikes = post.like

            return res.status(200).json(updatedLikes);
        }
    }
    catch(error){
        console.log(`Error in likeUnlikePost controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}


// Comment on a post
export const commentOnPost = async (req, res) =>{
    try{
        
        const postId = req.params.id; // get the post id from the request params
        const userId = req.user._id; // get the user id from the request object
        const { text } = req.body; // get the text from the request body

        const post = await Post.findById(postId); // find the post by id
        if(!post){
            return res.status(404).json({ error: "Post not found"});
        }

        if(!text){
            return res.status(400).json({ error: "Please enter a comment"});
        }

        const newComment = {
            text: text,
            user: userId,
        }; // create a new comment object

        post.comments.push(newComment); // add the new comment to the post
        await post.save(); // save the updated post

        res.status(200).json(post);
    }
    catch(error){
        console.log(`Error in commentOnPost controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}

// Delete a post
export const deletePost = async (req, res) =>{
    try{
        
        const postId = req.params.id; // get the post id from the request params
        const post = await Post.findById(postId); // find the post by id

        if(!post){
            return res.status(404).json({ error: "Post not found"});
        }

        if (post.user.toString() !== req.user._id.toString()){ // check if the id of the user who created the post is the same as the id of the current user who is trying to delete the post
            return res.status(401).json({ error: "You are not authorized to delete this post"});
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(postId); // delete the post

        res.status(200).json({ message: "Post deleted successfully"});
        
    }
    catch(error){
        console.log(`Error in deletePost controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}


// Get all posts
export const getAllPosts = async (req, res) =>{
    try{
        const posts = await Post.find().sort({createAt: -1}).populate({path:"user", select:"-password"}).populate({path:"comments.user", select:"-password"});

        if(posts.length === 0){
            return res.status(200).json([]); 
        }

        res.status(200).json(posts);
    }
    catch(error){
        console.log(`Error in getAllPosts controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}



// get posts liked by a specified user
export const getLikedPosts = async (req, res) =>{
    try{
        const userId = req.params.id; // userId is got from the request parameter
        const user = await User.findById(userId);
        const likedPost = await Post.find({ _id: {$in: user.likedPost}}).populate({path:"user",select:"-password"}).populate({path:"comments.user",select:"-password"}); // return all the postIds that are with in the likedPost array(stores postIds) of the user

        if(!user){
            return res.status(404).json({error: "User not found"}); 
        }

        if(likedPost.length === 0){
            return res.status(200).json([]); 
        }
        res.status(200).json(likedPost);

    }
    catch(error){
        console.log(`Error in getLikedPosts controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
};




// getting posts of the users the current user is following
export const getFollowingPosts = async (req, res) =>{
    try{
        const userId = req.user._id; // the current user Id
        const user =await User.findById(userId); // return the current user details

        if(!user){
            return res.status(404).json({error: "User not found"}); // if user returns a falsy value
        }

        const following = user.following; // returns the elements(userIds) stored in the current user's following array

        const feedPosts = await Post.find({user: {$in: following}}).sort({ createdAt:-1}).populate({path:"user", select:"-password"}).populate({path:"comments.user", select:"-password"}); // returns userIds that are in Posts and also in following array

        res.status(200).json(feedPosts);
    }
    catch(error){
        console.log(`Error in getFollowingPosts controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
};



// get a user's post
export const getUserPosts = async (req, res) => {
    try{
        const username = req.params.username; // get the username from the request parameter
        const user = await User.findOne({ username: username }); // find the user with the username

        if(!user){
            return res.status(404).json({error: "User not found"}); // if user isn't not found
        }

        const userPosts = await Post.find({user:user._id}).sort({createdAt:-1}).populate({path:"user", select:"-password"}).populate({path:"comments.user", select:"-password"}); // returns all the posts where the user is equal to to the user._id
        res.status(200).json(userPosts); 

    }
    catch(error){
        console.log(`Error in getUserPosts controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}