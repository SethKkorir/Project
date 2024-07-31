const express = require('express');
const router = express.Router();
const User = require('../models/user');
const PDFDocument = require('pdfkit'); // For PDF generation
const fs = require('fs'); // For file handling
const path = require('path'); // For file paths
const cron = require('node-cron');

const nodemailer = require('nodemailer');
require('events').EventEmitter.defaultMaxListeners = 20; // or any appropriate number


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
    const { name,role,email, company, whoAreYouVisiting, purposeOfVisiting } = req.body;

    // Validate required fields
    if (!name || !email || !whoAreYouVisiting || !purposeOfVisiting) {
        return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'A user with this email already exists.' });
            console.log(' This visitor with this email already exists.');

        }
        // console.log(' This visitor with this email already exists.');

        // Create a new user
        const newUser = new User({ name,role: 'Visitor',email, company, whoAreYouVisiting, purposeOfVisiting });
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
cron.schedule('0 0 * * *', async () => {
    try {
        // Fetch all visitor records before deletion
        const visitors = await User.find();

        // Generate a PDF report if there are visitors
        if (visitors.length > 0) {
            const doc = new PDFDocument();
            const filePath = path.join(__dirname, 'reports', `visitor_report_${new Date().toISOString().split('T')[0]}.pdf`);

            // Ensure the reports directory exists
            fs.mkdirSync(path.dirname(filePath), { recursive: true });

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
                doc.text(`Who are they visiting: ${visitor.whoAreYouVisiting}`);
                doc.text(`Purpose of visiting: ${visitor.purposeOfVisiting}`);
                doc.text(`Date: ${visitor.createdAt.toISOString().split('T')[0]}`);
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