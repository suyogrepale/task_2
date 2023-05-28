const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Logout route
router.get('/logout', (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy();
  res.redirect('/auth/login');
});

// Dashboard route
router.get('/dashboard', (req, res) => {
  // Check if the user is authenticated (session has a userId)
  if (req.session.userId) {
    // Find the user by ID and retrieve the name and account balance
    User.findById(req.session.userId).then((user) => {
      if (user) {
        // Render the dashboard page with user details
        res.render('dashboard', { name: user.name, balance: user.account_balance });
      } else {
        // User not found, redirect to login page
        res.redirect('/auth/login');
      }
    }).catch((error) => {
      console.log('Error finding user:', error);
      res.redirect('/auth/login');
    });
  } else {
    // User is not logged in, redirect to login page
    res.redirect('/auth/login');
  }
});

module.exports = router;
