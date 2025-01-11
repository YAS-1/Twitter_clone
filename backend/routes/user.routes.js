import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, getSuggestedUsers, followUnFollowUser, updateUserProfile } from "../controllers/user.controller.js"; // Import the getUserProfile, getSuggestedUsers, followUnFollowUser and updateUserProfile functions from the user.controllers.js file


const userRoutes = express.Router();


userRoutes.get("/profile/:username", protectRoute, getUserProfile); // The getUserProfile endpoint, which is a GET request that takes two parameters ie the path (/profile/:username) and the request handler function(getUserProfile - imported from the user.controllers.js file)
userRoutes.get("/suggested", protectRoute, getSuggestedUsers); // The getSuggestedUsers endpoint, which is a GET request that takes two parameters ie the path (/suggested) and the request handler function(getSuggestedUsers - imported from the user.controllers.js file)
userRoutes.post("/follow/:id",protectRoute,followUnFollowUser); // The followUnFollowUser endpoint, which is a POST request that takes two parameters ie the path (/follow/:id) and the request handler function(followUnFollowUser - imported from the user.controllers.js file)
userRoutes.post("/update", protectRoute, updateUserProfile); // The updateUserProfile endpoint, which is a POST request that takes two parameters ie the path (/update) and the request handler function(updateUserProfile - imported from the user.controllers.js file)


export default userRoutes; // export the userRoutes for using in the server.js file