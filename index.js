const express = require('express');
const User = require('./models/user');
const cors = require('cors');
// const mongoose = require('mongoose');
require('dotenv').config();


// To import the users routes
const UserRoutes = require('./routes/users');
//To import databse connection
require('./models/db');
// middle ware
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use('/api/users', UserRoutes);

const PORT = process.env.PORT ||3000;
// /
// // API Endpoint to Get All Visitors (GET request to '/visitors')
// app.get('/users', async (req, res) => {
//     try {
//       return res.json("Hello words");
//       console.log('Fetching all users...');
//       const users = await User.find();
//       console.log('Users found:', users);
//       res.json(users);
      
//     } catch (error) {
//       console.error('Error fetching users:', error.message);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   });
//   app.post('/users', async (req, res) => {
//     try {
//       return res.json("Hello World.");
//       console.log('Request body:', req.body);
  
//       // Validate the request body
//       if (!req.body.name || !req.body.email || !req.body.company || !req.body.whoAreYouVisiting || !req.body.purposeOfVisiting) {
//         return res.status(400).json({ message: 'All required fields must be provided.' });
//       }
  
//       const user = new User(req.body);
//       await user.save();
//       console.log('Saved user:', user);
//       res.status(201).json(user);
//     } catch (error) {
//       console.error('Error creating user:', error.message);
//       res.status(400).json({ message: error.message });
//     }
//   });


// To start the server
app.listen(PORT, () => {
    console.log(`Server has started at ${PORT}`);
});


