const mongoose = require('mongoose');
const User = require('./userModel');

const requestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        
    },
    status: {
        type: String,
        default: "pending",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("requests", requestSchema);