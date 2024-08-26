const express = require('express');
const router = express.Router();
const User = require('../models/user');
const PDFDocument = require('pdfkit'); // For PDF generation
const fs = require('fs'); // For file handling, fs is a module meaning File System which is a built in Module in Node.js
const path = require('path'); // For file paths, path also is module is another built-in module in Node.js that provides utilities for working with file and directory paths.
const cron = require('node-cron');

const nodemailer = require('nodemailer');


// Nodemailer configuration
const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS   // Your email password or App Password
    }
});

// Define a POST route for handling visitor registration
router.post('/', async (req, res) => {
    // Extract necessary fields from the request body
    const { name, role, email, company, purposeOfVisiting, hostId } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !purposeOfVisiting || !hostId) {
        // If any required field is missing, send a 400 Bad Request response
        return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    try {
        // Query the database to check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If a user with the provided email exists, send a 400 Bad Request response
            return res.status(400).json({ error: 'A user with this email already exists.' });
            
        }

        // If no existing user is found, create a new user object with the provided details
        const newUser = new User({ 
            name, 
            role: 'Visitor', // Set the role of the new user to 'Visitor'
            email, 
            company,  
            purposeOfVisiting, 
            hostId 
        });
        
        // Save the new user object to the database
        const savedUser = await newUser.save();
        
        // Prepare the email notification details
        const mailDetails = {
            from: process.env.EMAIL_USER, // Set the sender's email address from environment variables
            to: email, // Set the recipient's email address (the user's email)
            subject: 'New Visitor Registration', // Set the subject of the email
            text: `Welcome, kindly wait for the host to approve:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\nPurpose of visiting: ${purposeOfVisiting}`
        };

        // Send the email notification using the mail transporter
        mailTransporter.sendMail(mailDetails, (err, data) => {
            if (err) {
                // If there's an error sending the email, log the error message
                console.error('Error sending email:', err.message);
            } else {
                // If the email is sent successfully, log a success message
                console.log('Email sent successfully');
            }
        });

        // Respond to the client with the saved user details
        res.json(savedUser);
        // Log the saved visitor details for reference
        console.log(`Visitor details saved: ${email}`);
    } catch (err) {
        // If an error occurs during the process, log the error message
        console.error('Error creating a user:', err.message);
        // Send a 500 Internal Server Error response
        res.status(500).json({ error: 'Error creating a user' });
    }
});
//so cron.schedule is a function that will schedule a task that runs everyday at midnight (*/59 * * * *')
cron.schedule('0 0 * * *', async () => {
    try {
        // Here it find and fetch all visitor records before deletion
        const visitors = await User.find();

        // So here if the visitors records is found it will generate a PDF report using ~pdfkit~ library that ofcourse has been download 
        if (visitors.length > 0) {
            const doc = new PDFDocument();
            const filePath = path.join(__dirname, 'reports', `visitor_report_${new Date().toISOString().split('T')[0]}.pdf`);
            //_dirname is Nodejs global variable that contain the absolute path to directory
            //_reports  indicates PDF fill will be saved in a subdirectory called reports
            //`visitor_report_${new Date().toISOString().split('T')}.pdf` generates a file name that includes the current date in the format YYYY-MM-DD


            // Ensure the reports directory exists
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            //path.dirname(filePath) extracts the directory path from filePath, which is reports in this case.

            // Pipe the PDF into a file
            doc.pipe(fs.createWriteStream(filePath));

            // Add a title
            doc.fontSize(20).text('Visitor Report', { align: 'center' });
            doc.moveDown();

            // Add visitor details
            visitors.forEach(visitor => {
                doc.fontSize(12).text(`Name: ${visitor.name}`);
                doc.text(`Email: ${visitor.email}`);
                doc.text(`Company: ${visitor.company || 'N/A'}`);
                
                doc.text(`Purpose of visiting: ${visitor.purposeOfVisiting}`);
                // doc.text(`Date: ${visitor.createdAt.toISOString().split('T')[0]}`);
                doc.moveDown();
            });

            // Finalize the PDF and end the stream
            doc.end();
            console.log(`Visitor report saved to ${filePath}`);
        }

        // Delete all visitor records from the database
        await User.deleteMany({});
        console.log('Visitor records deleted successfully at midnight.');
    } catch (error) {
        console.error('Error during scheduled task:', error);
    }
});
// this is for report
router.get('/report', (req, res) => {
    const filePath = path.join(__dirname, 'reports', `visitor_report_${new Date().toISOString().split('T')[0]}.pdf`);
    
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(404).send('Report not found');
        }
    });
});
router.get('/reports', (req, res) => {
    const reportsDir = path.join(__dirname, 'reports');
    fs.readdir(reportsDir, (err, files) => {
        if (err) {
            console.error('Error reading reports directory:', err);
            return res.status(500).send('Error fetching reports');
        }
        // Filter for PDF files
        const reports = files.filter(file => file.endsWith('.pdf'));
        res.json(reports);
    });
});
// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
        // console.log('Getting all users...');
    } catch (err) {
        console.error('Error getting users:', err.message);
        res.status(500).json({ error: 'Error getting users' });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, company, purposeOfVisiting } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, company,  purposeOfVisiting }, { new: true });
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
// Approve user
router.post('/:userId/approve', async (req, res) => {
    const { userId } = req.params;

    try {
        // Update the current user's status to 'approved'
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { status: 'approved' }, // Update the status to 'approved'
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Notify the next visitor in the queue
        const nextVisitor = await User.findOne({ hostId: updatedUser.hostId, status: 'waiting' }).sort({ createdAt: 1 });
        if (nextVisitor) {
            // Set a notification message for the next visitor
            nextVisitor.notification = 'You are next in line! Please be patient.';
            await nextVisitor.save(); // Save the notification to the database
        }

        res.json(updatedUser); // Return the updated user
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Deny user
router.post('/:userId/deny', async (req, res) => {
    const { userId } = req.params;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { status: 'denied' }, // Update the status to 'denied'
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Notify the next visitor in the queue
        const nextVisitor = await User.findOne({ hostId: updatedUser.hostId, status: 'waiting' }).sort({ createdAt: 1 });
        if (nextVisitor) {
            // Implement notification logic, e.g., via WebSocket or a notification service
            console.log(`Notify ${nextVisitor.name}: The host is now available.`);
        }

        res.json(updatedUser); // Return the updated user
    } catch (error) {
        console.error('Error denying user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;