const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware=require("../middlewares/authMiddleware")

router.post('/register', async (req, res) => {
    try {
        //   check duplicate user
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        //   hash password
    // Generate a salt
    const salt = await bcrypt.genSalt(10); 
    // Hash the user's password using the salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt); 
    
    // Replace the plain-text password with the hashed password in the request body
    req.body.password = hashedPassword; 

    // Create a new User object with the request data (including the hashed password)
    const user = new User(req.body);

    // Save the user to the MongoDB database
    await user.save(); 
    
    // Send a success response back to the client
    res.send({
      message: "User created successfully",
      data: null,
      success: true,
    });
  } catch (e) {
    // If an error occurs, send the error message and a failure response
    res.send({
      message: e.message,
      success: false,
    });
  }
});

// login user account
router.post('/login', async (req, res) => {
  
    try {
        // check is user exists 
        // console.log("request arrived")
        // console.log(req.body)
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
                return res.send({
                message: "Invalid email or password",
                success: false,
                });      
        }
        //   check password
        // console.log("User found")
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        // console.log(isMatch, "Hi Bro you Entered Wrong Password -- inside router");
        if (!isMatch) {
        
            return res.send({
                message: "Incorrect password",
                success: false,

            });
        }
        //   check if user is verified
        // if (!user.isVerified) {
        //     return res.send({
        //         message: "Your account is not verified yet or suspended",
        //         success: false,
        //     });
        //     }
        //   send token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        // console.log("token created",token)
        res.send({
            message: "user logged in successfully",
            data: token,
            success:true,
        })
    } catch (error) {
        return res.status(502).json({msg: "Server side error occurred"})
    }
});

//get user info
router.get('/get-user-info', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        user.password = ""
        res.send({
            message: "user info fetched successfully",
            data: user,
            success:true,
        })
        
    } catch (error) {
        return res.status(502).json({ msg: "Server side error occurred" })
    }
});
    
module.exports = router;