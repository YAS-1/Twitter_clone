import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createPost, likeUnlikePost, commentOnPost, deletePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } from '../controllers/post.controller.js';

const postRoutes = express.Router();

postRoutes.post("/create", protectRoute, createPost); // API for creating a post

postRoutes.post("/like/:id", protectRoute, likeUnlikePost); // API for liking a post

postRoutes.post("/comment/:id", protectRoute, commentOnPost); // API for commenting on a post

postRoutes.delete("/delete/:id", protectRoute, deletePost); // API for deleting a post

postRoutes.get("/getAll", protectRoute, getAllPosts); // API for getting all posts

postRoutes.get("/likes/:id", protectRoute, getLikedPosts); // API for getting all the posts liked by a specific user

postRoutes.get("/followingPosts", protectRoute, getFollowingPosts); // API for getting the posts of the users the current user follows

postRoutes.get("/user/:username", protectRoute, getUserPosts); // API to get the posts of a specific user

export default postRoutes;