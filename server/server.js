require('dotenv').config();
const express = require("express");
const connectDB = require('./config/dbconfig');  // Correct import for DB connection
const usersRoute = require('./routes/usersRoute');
const transactionsRoute = require("./routes/TransactionsRoute");
const requestsRouter = require("./routes/requestsRoute");


// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();  // Connect to the database

// Middleware to parse JSON data
app.use(express.json());



// Use the user routes
app.use('/api/users', usersRoute);
app.use('/api/transactions', transactionsRoute);
app.use('/api/requests', requestsRouter);


// Server listening on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
