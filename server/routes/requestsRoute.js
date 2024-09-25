const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();  // Initialize router
const Request = require("../models/requestModel");
const User = require("../models/userModel");

// get all request of a user 
router.post("/get-all-requests-by-user", authMiddleware, async (req, res) => {
    try {
        // console.log(req);
        const requests = await Request.find({
            $or: [{ sender: req.body.userId }, { receiver: req.body.userId }],
        }).populate("sender").populate("receiver");
        // console.log(requests);
        res.status(200).send({
            data: requests,
            message: "requests fetched successfully from db",
            success: true,
        });
    } catch (error) {
        res.status(500).send({
            data: null,
            message: "Error fetching requests from db",
            success: false,
        });
    }
});

// send a request to another user

router.post("/send-request",authMiddleware, async (req, res) => {
    try {
        const { receiver, amount, description } = req.body;
        const request = new Request({
            sender: req.body.userId,
            receiver: receiver,
            amount: amount,
            description,
        });
        await request.save();

        res.status(200).send({
            data: request,
            message: "request sent successfully",
            success:true,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

//update a request status

router.post("/update-request-status", authMiddleware, async (req, res) => {
    try {
        // console.log("request received at backend", req.body);
        if (req.body.status === "Accepted") {
            const sender = await User.findByIdAndUpdate(req.body.receiver._id,{
                $inc: { balance: -req.body.amount },
            });
            const receiver = await User.findByIdAndUpdate(req.body.sender._id, {
                $inc: { balance: req.body.amount },
            });
        }
        const request = await Request.findByIdAndUpdate(req.body.requestId, {
                status: req.body.status,
            });

        res.status(200).send({
            data: request,
            message: "Request status updated successfully",
            success:true,
        })
        
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: null,
            success:false,
        })
    }
});

module.exports = router;