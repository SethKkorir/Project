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
        res.status(201).json(host); // Respond with 201 Created status
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
router.post('/', async (req, res) => {
  const { firstName, password } = req.body;

  try {
    // Finding  the host by their first name
    const host = await Host.findOne({ firstName });

    if (!host) {
      return res.status(401).json({ error: 'Invalid first name or password' });
    }

    // now comparing the provided password with the stored password
    if (password !== host.password) {
      return res.status(401).json({ error: 'Invalid first name or password' });
    }

    // Successful login
    res.json({ firstName: host.firstName });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
