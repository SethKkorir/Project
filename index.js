const express = require('express');
const User = require('./models/user');
const Host = require('./models/host');
const cors = require('cors');
const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');

const password = 'pass123';

require('dotenv').config();
const defaultPort = 8002;
let port = process.env.PORT || defaultPort;

// To import the users and hosts routes
const UserRoutes = require('./routes/users');
const HostRoutes = require('./routes/users2');

// To import database connection
require('./models/db');

// Middleware
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// Use the routes
app.use('/api/users', UserRoutes);
app.use('/api/users2', HostRoutes); 
// app.use('/api/visitors', visitorRouter);

const logoDesignUrl = 'http://127.0.0.1:5500/public/visitors/html/register.html';

app.get('/generateQR', async (req, res) => {
    try {
      const qrCodeImage = await QRCode.toDataURL(logoDesignUrl);
      res.send(qrCodeImage); // Return only the data URL
    } catch (err) {
      console.error('Error generating QR code:', err);
      res.status(500).send('Internal Server Error');
    }
  });

const startServer = (port) => {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use, trying another port...`);
        startServer(port + 1);
      } else {
        console.error(`Server error: ${err}`);
      }
    });
  };
  
  startServer(port);