const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Logout route
router.get('/logout', (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy();
  res.redirect('/login');
});

// Deposit route
router.post('/deposit', (req, res) => {
  const { amount } = req.body;

  User.findByIdAndUpdate(req.session.userId, { $inc: { account_balance: amount } }, { new: true })
    .then((user) => {
      if (user) {
        res.render('dashboard', { name: user.name, balance: user.account_balance });
      } else {
        res.redirect('/login');
      }
    })
    .catch((error) => {
      console.log('Error depositing funds:', error);
      res.redirect('/login');
    });
});

// Withdraw route
router.post('/withdraw', (req, res) => {
  const { amount, mobile } = req.body;

  User.findById(req.session.userId)
    .then((user) => {
      if (!user) {
        return res.redirect('/login');
      }

      if (user.account_balance < amount) {
        return res.send('Insufficient balance.');
      }

      // Find the user with the provided mobile number
      User.findOne({ mobile: mobile })
        .then((recipient) => {
          if (!recipient) {
            return res.send('Recipient not found.');
          }

          // Perform the withdrawal operation
          user.account_balance -= amount;
          recipient.account_balance += amount;

          // Save both the sender and recipient documents
          return Promise.all([user.save(), recipient.save()])
            .then(([sender, recipient]) => {
              res.render('dashboard', { name: sender.name, balance: sender.account_balance });
            });
        })
        .catch((error) => {
          console.log('Error finding recipient:', error);
          res.redirect('/login');
        });
    })
    .catch((error) => {
      console.log('Error finding user:', error);
      res.redirect('/login');
    });
});


module.exports = router;
