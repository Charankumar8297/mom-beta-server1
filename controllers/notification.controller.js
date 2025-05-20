const Notification = require('../models/notification.model');

const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('Fetching notifications for user:', userId);

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    console.log('Found notifications:', notifications.length);

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Clear notifications for logged-in user
const clearNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    await Notification.deleteMany({ userId });
    res.status(200).json({ message: 'Notifications cleared successfully' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send notification to a single user
const sendNotificationToUser = async (req, res) => {
  try {
    const { userId, title, description } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ message: 'userId and title are required' });
    }

    const notification = new Notification({
      userId,
      title,
      description,
    });

    await notification.save();
    return res.status(201).json({ message: 'Notification sent successfully', notification });
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ message: 'Failed to send notification' });
  }
};

module.exports = {
  getNotifications,
  clearNotifications,
  sendNotificationToUser,
};
