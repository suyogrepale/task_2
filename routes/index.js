const express = require('express');
const router = express.Router();
const User = require('../models/user');
const path = require('path'); // Import the path module
// Home route
router.get('/', (req, res) => {
   res.send('Welcome to the home page');
});

// Login route
router.get('/login', (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="POST" action="/login">
      <input type="text" name="mobile" placeholder="Mobile No" /><br />
      <input type="password" name="password" placeholder="Password" /><br />
      <button type="submit">Login</button>
    </form>
    <button onclick="location.href='/register'">Register</button>
  `);
});

// Registration route
router.get('/register', (req, res) => {
  res.send(`
    <h2>Registration</h2>
    <form method="POST" action="/register">
      <input type="text" name="name" placeholder="Name" /><br />
      <input type="text" name="mobile" placeholder="Mobile No" /><br />
      <input type="password" name="password" placeholder="Password" /><br />
      <button type="submit">Register</button>
    </form>
    <button onclick="location.href='/login'">Login</button>
  `);
});


router.post('/register', (req, res) => {
    const { name, mobile, password } = req.body;
  
    const newUser = new User({
      name: name,
      mobile: mobile,
      password: password
    });
  
    newUser.save().then(() => {
      console.log('User registered:', newUser);
      res.redirect('/login');
    }).catch((error) => {
      if (error.code === 11000) {
        // Duplicate key error
        console.log('Mobile number already exists:', mobile);
        res.send('Mobile number already exists. Please choose a different mobile number.');
      } else {
        console.log('Error registering user:', error);
        res.redirect('/auth/register');
      }
    });
  });
  

// Login form submission route
router.post('/login', (req, res) => {
    const { mobile, password } = req.body;
  
    User.findOne({ mobile: mobile }).then((user) => {
      if (!user || user.password !== password) {
        // Invalid credentials, redirect to login page
        res.redirect('/login');
      } else {
        // Store the user's ID in the session
        req.session.userId = user._id;
        res.redirect('/dashboard');
      }
    }).catch((error) => {
      console.log('Error finding user:', error);
      res.redirect('/login');
    });
  });

module.exports = router;
