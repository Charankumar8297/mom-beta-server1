const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth');
const Notification = require('../models/notification.model');
const User = require('../models/user.models');
const { getNotifications, clearNotifications } = require('../controllers/notification.controller');

// ✅ Send a notification to a single user (the one in token)
router.post('/notify', userAuth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const notification = new Notification({
      userId: req.userId,  // Comes from JWT via middleware
      title,
      description
    });

    await notification.save();

    res.status(201).json({ message: 'Notification created', notification });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification', error: error.message });
  }
});

// ✅ Send notifications to all users
router.post('/notify-all', userAuth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const users = await User.find({}, '_id');

    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }

    const notifications = users.map(user => ({
      userId: user._id,
      title,
      description
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ message: 'Notification sent to all users' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ message: 'Failed to send notifications', error: error.message });
  }
});

router.get('/notification', userAuth, getNotifications);

router.delete('/notification-clear', userAuth, clearNotifications);

module.exports = router;
