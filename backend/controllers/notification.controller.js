import User from "../models/user.model.js";
import Notification from "../models/notifications.js";

// function to get all the notifications sent to a user
export const getAllNotifications = async (req, res) =>{
    try{
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: "User not found"}); // If there are no user details
        }

        const allNotifications = await Notification.find({ to:userId }).populate({path:"from", select:"username profileImage"}); // returns notifications where the to field contains the user's Id

        await Notification.updateMany({to:userId}, {read:true}); // Updating the read field to true showing that we have seen the notification

        res.status(200).json(allNotifications);
    }
    catch(error){
        console.log(`Error in getAllNotifications controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}


// deleting the notifications sent to a user
export const deleteNotification =  async (req, res) => {
    try{
        const userId = req.user._id;

        await Notification.deleteMany({to:userId}); // find and delete all notifications where the to field matches the current user id

        res.status(200).json({message:"Notifications delete successfully"});
    }
    catch(error){
        console.log(`Error in deleteNotification controller: ${error.message}`);
        res.status(500).json({ error: "Server error"});
    }
}