var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Given a userId, return user info */
router.get('/:userId', (req, res, next) => {
  User.findById(req.params.userId)
    .exec()
    .then(userData => {
      res.status(200).json({
        user: userData
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

/* Add a user to the database given username and password */
router.post('/', (req, res, next) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    password: req.body.password
  });

  user.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Added user to database",
        user
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});

module.exports = router;
