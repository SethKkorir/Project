const mongoose = require('mongoose');

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { //Attempting to connect to Mongo DB database using conn string in env file
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`); // this will log  that the Mongodb is connected with the host which ofcourse i am using Localhost
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();