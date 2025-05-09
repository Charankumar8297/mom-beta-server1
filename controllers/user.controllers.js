const User = require('../models/user.models');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const nodemailer = require("nodemailer");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Start Route - Get all users
const startRoute = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).send({ message: 'Welcome to the pharmacy app', users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Send OTP via Email
const emailOtp = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`OTP for ${email}: ${otp}`);

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP for Verification',
            text: `Your mom pharmacy OTP is ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Internal server error' });
            } else {
                console.log('Email sent:', info.response);
                req.session.otp = otp;
                return res.status(200).json({ message: 'OTP sent successfully' });
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
// Get user details by ID
const getUserDetails = async (req, res) => {
    const userId = req.userId;
    try {
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User details fetched successfully', userDetails });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Register user (update user details if not already registered)
const registerUsers = async (req, res) => {
    const { name, dateOfBirth, gender, primaryAddress } = req.body;
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        if (user.isRegistered) {
            return res.status(400).json({ message: 'User already registered' });
        }

        await User.updateOne(
            { _id: userId },
            { name, dateOfBirth, gender, primaryAddress, isAdmin: false, isRegistered: true }
        );

        return res.status(201).json({ message: 'User registered successfully', userId: userId });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Login using OTP (Mobile)
const otpLogin = async (req, res) => {
    const { mobileNo } = req.body;

    try {
        let user = await User.findOne({ mobileNo });

        if (!user) {
            user = new User({ mobileNo });
            await user.save();
            console.log('User created:', user);
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(`OTP for ${mobileNo}: ${otp}`);

        const message = await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${mobileNo}`
        });

        console.log('Message sent:', message.sid);
        req.session.otp = otp;
        req.session.userId = user._id;

        return res.status(200).json({ message: 'OTP sent successfully', userId: user._id });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify OTP and login
const verifyOtp = async (req, res) => {
    const { otp, mobileNo } = req.body;

    try {
        if (Number(req.session.otp) === Number(otp)) {
            const user = await User.findOne({ mobileNo });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

            req.session.otp = null; // Clear OTP
            req.session.userId = user._id;
            req.session.mobileNo = user.mobileNo;

            const isExist = !!(user.name && user.dateOfBirth && user.gender);

            return res.status(200).json({ message: 'OTP verified successfully', token, isExist });
        } else {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    registerUsers,
    otpLogin,
    startRoute,
    verifyOtp,
    deleteUser,
    getUserDetails,
    emailOtp,
    updateUser
};
