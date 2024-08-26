const express = require('express');
const router = express.Router();
const Host = require('../models/host');

// Creating a new host
router.post('/', async (req, res) => {
    // console.log(req.body);
    const { idNumber, firstName, lastName,surName, mobileNumber, email, role, password, confirmPassword } = req.body; 
    const newHost = new Host({ idNumber, firstName, lastName, surName,mobileNumber, email, role, password, confirmPassword });

    try {
        const host = await newHost.save(); // Save the new host
        res.status(201).json({
          hostId: host._id,
          firstName: host.firstName
        }); // Respond with 201 Created status
    } catch (err) {
        console.error('Error creating host:', err);
        if (err.name === 'ValidationError') {
          res.status(400).json({ error: err.message });
        } else if (err.code === 11000) { // Duplicate key error
          res.status(400).json({ error: 'Email already exists' });
        } else {
          res.status(500).json({ error: 'Error creating host' });
        }
      }
    });
// Fetching all hosts
router.get('/', async (req, res) => {
    try {
        const hosts = await Host.find(); // Fetch all hosts
        res.json(hosts); // Respond with the list of hosts
    } catch (err) {
        console.error('Error fetching hosts:', err);
        res.status(500).json({ error: 'Error fetching hosts' });
    }
});
router.post('/login', async (req, res) => {
  const { firstName, password } = req.body;

  try {
      const host = await Host.findOne({ firstName });
      if (!host || password !== host.password) {
          return res.status(401).json({ error: 'Invalid first name or password' });
      }
      res.json({ 
        firstName: host.firstName,
        hostId: host._id,
      });
  } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).json({ error: 'Internal server error' });
  }
});
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
