const router = require("express").Router();
const Transaction = require("../models/transactionModel");
const authMiddleware = require('../middlewares/authMiddleware');
const User = require("../models/userModel");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,       // Use your Razorpay Key ID from your .env file
    key_secret: process.env.RAZORPAY_KEY_SECRET // Use your Razorpay Key Secret from your .env file
});

router.post('/transfer-funds', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();  // Start a session for atomic operations
    session.startTransaction();  // Begin transaction
    // console.log("request Recieved for transfer of funds ", req.body);
    try {
        // Validate input
        const { sender, receiver, amount } = req.body;
        if (!sender || !receiver || !amount) {
            return res.status(400).send({
                message: "All fields (sender, receiver, amount) are required.",
                success: false,
            });
        }

        // Create a new transaction
        const newTransaction = new Transaction(req.body);
        await newTransaction.save({ session });

        // Decrease the sender's balance
        const senderUser = await User.findByIdAndUpdate(sender, {
            $inc: { balance: -amount },
        }, { session });

        if (!senderUser) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Sender not found",
                success: false,
            });
        }

        // Increase the receiver's balance
        const receiverUser = await User.findByIdAndUpdate(receiver, {
            $inc: { balance: amount },
        }, { session });

        if (!receiverUser) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Receiver not found",
                success: false,
            });
        }

        await session.commitTransaction();  // Commit transaction if everything is successful
        session.endSession();

        res.status(200).send({
            message: "Transaction successful",
            data: newTransaction,
            success: true,
        });
    } catch (error) {
        await session.abortTransaction();  // Roll back transaction if any error occurs
        session.endSession();
        res.status(500).send({
            message: "Transaction Failed",
            data: error.message,
            success: false,
        });
    }
});

// Verify receiver's account number
router.post("/verify-account", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.receiver);

        if (user) {
            res.status(200).send({
                message: "Account Verified",
                data: user,
                success: true,
            });
        } else {
            res.status(404).send({
                message: "Account Not Found",
                data: null,
                success: false,
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "An error occurred while verifying the account",
            data: null,
            success: false,
        });
    }
});

//get all transactions for a user
router.post("/get-all-transactions-by-user", authMiddleware, async (req, res) => {
  try {
    // console.log("Request received for transactions:", req.body);

    const transactions = await Transaction.find({
      $or: [{ sender: req.body.userId }, { receiver: req.body.userId }],
    }).sort({createdAt:-1})
    .populate("receiver")
    .populate("sender");  

    if (!transactions) {
      return res.status(404).send({
        message: "No transactions found",
        data: null,
        success: false,
      });
    }

    // console.log("Transactions retrieved:", transactions);

    res.status(200).send({
      message: "Transactions retrieved successfully",
      data: transactions,
      success: true,
    });
  } catch (error) {
    console.error("Error while retrieving transactions:", error);
    res.status(500).send({
      message: "An error occurred while retrieving transactions",
      data: null,
      success: false,
    });
  }
});


// Create order route
router.post("/create-order", authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).send({
                message: "Amount is required",
                success: false,
            });
        }

        // Create an order in Razorpay
        const options = {
            amount: amount*100 ,  // Amount in the smallest currency unit (e.g., paise in INR)
            currency: "INR",       // Specify the currency
            receipt: `receipt_order_${Date.now()}`, // Unique receipt id
            payment_capture: 1,     // Automatic capture
        };

        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            return res.status(500).send({
                message: "Some error occurred while creating the order",
                success: false,
            });
        }

        res.status(200).send({
            message: "Order created successfully",
            data: order,
            success: true,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send({
            message: "Failed to create order",
            success: false,
        });
    }
});

// Verify Payment Route
// router.post('/verify-payment', async (req, res) => {
    

//   try {
//       const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
     
//       const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET;
//     // Create a string to hash
//     const shasum = crypto.createHmac('sha256', RAZORPAY_SECRET);
//     shasum.update(razorpay_order_id + '|' + razorpay_payment_id);
//     const digest = shasum.digest('hex');

//     // Compare the generated hash with the signature sent by Razorpay
//     if (digest === razorpay_signature) {
//       // If the signature matches, the payment is verified
//       return res.status(200).send({
//         status: 'Payment Verified',
//         message: 'Payment was successful and verified.'
//       });
        
        
//     } else {
//       // If the signature doesn't match, reject the payment
//       return res.status(400).send({
//         status: 'Payment Verification Failed',
//         message: 'Payment verification failed due to signature mismatch.'
//       });
//     }
//   } catch (error) {
//     return res.status(500).send({
//       message: 'An error occurred during payment verification.',
//       error: error.message
//     });
//   }
// });

router.post('/verify-payment', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start a transaction to ensure atomicity

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, userId } = req.body;
    const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    
    // Verify the Razorpay signature
    const shasum = crypto.createHmac('sha256', RAZORPAY_SECRET);
    shasum.update(razorpay_order_id + '|' + razorpay_payment_id);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      await session.abortTransaction();
      return res.status(400).send({
        status: 'Payment Verification Failed',
        message: 'Payment verification failed due to signature mismatch.',
      });
    }

    // If payment is verified, update the user's balance
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { balance: amount} }, // Increment the user's balance by the deposited amount
      { new: true, session } // Return the updated user and use the session
    );

    if (!user) {
      await session.abortTransaction();
      return res.status(404).send({
        status: 'User Not Found',
        message: 'The user does not exist.',
      });
    }

    // Log the transaction
    const newTransaction = new Transaction({
      amount,
      sender: userId, // No sender for deposits
      receiver: userId,
      reference: razorpay_payment_id,
      status: 'success',
    });

    await newTransaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({
      status: 'Payment Verified',
      message: 'Payment was successful and balance updated.',
      data: user, // Return updated user details with the new balance
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send({
      message: 'An error occurred during payment verification or balance update.',
      error: error.message,
    });
  }
});


module.exports = router;
