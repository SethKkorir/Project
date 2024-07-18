const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Create a new user
router.post('/', (req, res) => {
    const { name, email, company, whoAreYouVisiting, purposeOfVisiting } = req.body;

    if (!name || !email || !company || !whoAreYouVisiting || !purposeOfVisiting) {
        return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    const newUser = new User({ name, email, company, whoAreYouVisiting, purposeOfVisiting });
    console.log('Visitor details saving...');
    newUser.save()
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            console.error('Error creating a user:', err.message);
            res.status(500).json({ error: 'Error creating a user' });
        });
});


// Get all users
router.get('/', (req, res) => {
    console.log('Getting all users...');
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            console.error('Error getting users:', err.message);
            res.status(500).json({ error: 'Error getting users' });
        });
});

// Update a user by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, company, whoAreYouVisiting, purposeOfVisiting } = req.body;

    User.findByIdAndUpdate(id, { name, email, company, whoAreYouVisiting, purposeOfVisiting }, { new: true })
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            console.error('Error updating a user:', err.message);
            res.status(500).json({ error: 'Error updating a user' });
        });
});

// Delete a user by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
  
    User.findByIdAndDelete(id)
      .then(deletedUser => {
        if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
      })
      .catch(err => {
        console.error('Error deleting a user:', err.message);
        res.status(500).json({ error: 'Error deleting a user' });
      });
  });
module.exports = router;
