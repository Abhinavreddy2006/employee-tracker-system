import Notification from "../models/notificationModel.js";

// GET notifications for the logged-in user
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// MARK a single notification as read
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { read: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// MARK ALL notifications as read
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, read: false },
            { read: true }
        );
        res.status(200).json({ message: "All marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getNotifications, markAsRead, markAllAsRead };
