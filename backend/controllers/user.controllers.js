import User from "../models/user.model.js";


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
        console.log("getSuggestedUsers controller");
        res.status(200).json({ message: "getSuggestedUsers controller" });
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
            await User.findByIdAndUpdate(id, { $pull: { followers:currentUser._id }}); // remove the current user id from the followers array of the user to modify
            res.status(200).json({ message: "User unfollowed" });
        }
        else{
            //Follow the user
            await User.findByIdAndUpdate(currentUser._id, { $push: { following: id }}); // add the user id to the following array of the current user
            await User.findByIdAndUpdate(id, { $push:  {followers: currentUser._id }}); // add the current user id to the followers array of the user to modify
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
    try {
        console.log("updateUserProfile controller");
        res.status(200).json({ message: "updateUserProfile controller" });
    }
    catch(error){
        console.log(`Error in updateUserProfile controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}
