const express = require('express');
const router = express.Router();
const Host = require('../models/host');

// Creating a new host
router.post('/', async (req, res) => {
    console.log(req.body);
    const { name, email, role, password, confirmPassword } = req.body; 
    const newHost = new Host({ name, email, role, password, confirmPassword });

    try {
        const host = await newHost.save(); // Save the new host
        res.status(201).json(host); // Respond with 201 Created status
    } catch (err) {
        console.error('Error creating host:', err);
        res.status(500).json({ error: 'Error creating host' });
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

module.exports = router;
