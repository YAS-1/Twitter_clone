import express, { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getAllNotifications, deleteNotification } from "../controllers/notification.controller.js";

const notificationRoutes = express.Router();


notificationRoutes.get("/getNotifications", protectRoute, getAllNotifications); // API for getting all the notifications sent to the user
notificationRoutes.delete("/", protectRoute, deleteNotification); // API for deleting a notification

export default notificationRoutes;