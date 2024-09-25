
const { default: mongoose } = require("mongoose");
const { type } = require("os");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber:{
    type: String,
    required: true,
},
    identificationType: {
        type: String,
        required: true,
},
    identificationNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    isVerifed:
    {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps:true,
});

module.exports = mongoose.model("User", userSchema);
