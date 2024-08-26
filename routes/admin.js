const express = require('express');
const router = express.Router();
const Admin = require('../models/admin'); // Adjust the path as necessary

// Creating a new admin
router.post('/', async (req, res) => {
    const { firstName, lastName, surName, mobileNumber, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    const newAdmin = new Admin({ firstName, lastName, surName, mobileNumber, email, password, confirmPassword });

    try {
        const admin = await newAdmin.save(); // Save the new admin
        res.status(201).json({
            adminId: admin._id,
            firstName: admin.firstName
        }); // Respond with 201 Created status
    } catch (err) {
        console.error('Error creating admin:', err);
        if (err.name === 'ValidationError') {
            res.status(400).json({ error: err.message });
        } else if (err.code === 11000) { // Duplicate key error
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Error creating admin' });
        }
    }
});

// Fetching all admins
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find(); // Fetch all admins
        res.json(admins); // Respond with the list of admins
    } catch (err) {
        console.error('Error fetching admins:', err);
        res.status(500).json({ error: 'Error fetching admins' });
    }
});

// Admin login
router.post('/login', async (req, res) => {
    const { firstName, password } = req.body; // firstName

    try {
        const admin = await Admin.findOne({ firstName }); // Find admin by first name
        if (!admin || password !== admin.password) {
            return res.status(401).json({ error: 'Invalid first name or password' });
        }
        res.json({
            firstName: admin.firstName,
            adminId: admin._id,
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err.message);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

module.exports = router;