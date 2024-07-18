const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT ||3000;

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// Visitor Schema
const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    company: {
        type: String,
        required: true
    },
    whoAreYouVisiting: {
        type: String,
        required: true
    },
    purposeOfVisiting: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', visitorSchema);
module.exports = User;
// API Endpoint to Get All Visitors (GET request to '/visitors')
app.get('/users', async (req, res) => {
    try {
      console.log('Fetching all users...');
      const users = await User.find();
      console.log('Users found:', users);
      res.json(users);
      
    } catch (error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  app.post('/users', async (req, res) => {
    try {
      console.log('Request body:', req.body);
  
      // Validate the request body
      if (!req.body.name || !req.body.email || !req.body.company || !req.body.whoAreYouVisiting || !req.body.purposeOfVisiting) {
        return res.status(400).json({ message: 'All required fields must be provided.' });
      }
  
      const user = new User(req.body);
      await user.save();
      console.log('Saved user:', user);
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error.message);
      res.status(400).json({ message: error.message });
    }
  });

app.listen(PORT, () => {
    console.log(`Server has started at ${PORT}`);
});


