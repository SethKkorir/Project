const express = require('express');
const router = express.Router();
const User = require('../models/user');
const nodemailer = require('nodemailer');

// Nodemailer configuration
const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS   // Your email password or App Password
    }
});

// Create a new user
router.post('/', async (req, res) => {
    const { name, email, company, whoAreYouVisiting, purposeOfVisiting } = req.body;

    // Validate required fields
    if (!name || !email || !whoAreYouVisiting || !purposeOfVisiting) {
        return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'A user with this email already exists.' });
            
        }
        console.log(' This visitor with this email already exists.');

        // Create a new user
        const newUser = new User({ name, email, company, whoAreYouVisiting, purposeOfVisiting });
        const savedUser = await newUser.save();

        // Prepare email notification
        const mailDetails = {
            from: process.env.EMAIL_USER,
            to: email, // Send to the user's email
            subject: 'New Visitor Registration',
            text: `A new visitor has registered:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\nWho are they visiting: ${whoAreYouVisiting}\nPurpose of visiting: ${purposeOfVisiting}`
        };

        // Send email notification
        mailTransporter.sendMail(mailDetails, (err, data) => {
            if (err) {
                console.error('Error sending email:', err.message);
            } else {
                console.log('Email sent successfully');
            }
        });

        res.json(savedUser);
        console.log(`Visitor details saved: ${email}`);
    } catch (err) {
        console.error('Error creating a user:', err.message);
        res.status(500).json({ error: 'Error creating a user' });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
        console.log('Getting all users...');
    } catch (err) {
        console.error('Error getting users:', err.message);
        res.status(500).json({ error: 'Error getting users' });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, company, whoAreYouVisiting, purposeOfVisiting } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, company, whoAreYouVisiting, purposeOfVisiting }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating a user:', err.message);
        res.status(500).json({ error: 'Error updating a user' });
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting a user:', err.message);
        res.status(500).json({ error: 'Error deleting a user' });
    }
});

module.exports = router;