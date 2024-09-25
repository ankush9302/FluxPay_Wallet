const mongoose = require('mongoose');
const User = require('./userModel');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,  // Corrected to ObjectId
        ref: 'User',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,  // Corrected to ObjectId
        ref: 'User',
        required: true,
    },
   
    reference: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Transaction", transactionSchema);
