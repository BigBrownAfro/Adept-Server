var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const encrypt = require('../encrypt')

const User = require('../models/user');
const user = require('../models/user');

/* GET response */
router.get('/', function(req, res, next) {
  res.status(200).json({
    message: "server is up and running"
  });
});

//-----------------------Management------------------------//

//Given a user id (not username) delete the user from the database
router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User Deleted",
        result: result
      });
    })
    .catch(err =>{
      res.status(500).json({
        error: err
      })
    });
});

//-----------------------Verification-----------------------//

/* Given a userId, verify a user's existence with that id */
router.get('/verify/:userId', (req, res, next) => {
  User.findById(req.params.userId)
      .exec()
      .then(userData => {
          if(userData){
              res.status(200).json({
                  message: "account exists",
                  boolean: true
              });
          }else{
              res.status(200).json({
                  message: "account does not exist",
                  boolean: false
              });
          }
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          });
      });
});

/* Given a username, verify a user's existence with that username */
router.get('/verify/username/:username', (req, res, next) => {
  User.find({username: req.params.username})
    .exec()
    .then(doc => {
      var user = doc[0];
      if(user){
        res.status(200).json({
          message: "account exists",
          boolean: true
        });
      }else{
        res.status(200).json({
          message: "account does not exist",
          boolean: false
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

/* Given an email address, verify a user's existence with that email */
router.get('/verify/email/:email', (req, res, next) => {
  User.find({email: req.params.email})
    .exec()
    .then(doc => {
      var user = doc[0];
      if(user){
        res.status(200).json({
          message: "account exists",
          boolean: true
        });
      }else{
        res.status(200).json({
          message: "account does not exist",
          boolean: false
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//-----------------LOGIN----------------------//

/* given username and password, returns whether or not they match a user in the database */
router.post('/login', (req, res, next) => {
  //Set username and password
  const username = req.body.username;
  const password = req.body.password;

  //Compare given data to database and respond true or false
  User.find({username: req.body.username})
    .exec()
    .then(doc => {
      var user = doc[0]
      if (user) {
        console.log(user);
        if(encrypt.compare(password, user.password)){
          res.status(200).json({
            message: "Successful sign-in",
            signedIn: true
          });
        } else {
          res.status(404).json({
            message: "Invalid Credentials",
            signedIn: false
          })
        }
      } else {
        res.status(404).json({
          message: "Invalid Credentials",
          signedIn: false
        })
      }
    });
});

//-------------------SIGNUP---------------------//

/* given username and password creates a new user and adds it to the database */
router.post('/signup', (req, res, next) => {
  //Check to see if user already exists
  User.find({username: req.body.username})
    .exec()
    .then(doc => {
      const user = doc[0];
      if (user) { //If the user exists
        console.log("Signup failed, user already exists");
        console.log(user);
        return res.status(409).json({
          message: "User already exists",
          boolean: false
        });
      } else { //If the user does not exist
        //encrypt the raw password
        const hash = encrypt.hash(req.body.password);

        //create a new user
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          username: req.body.username,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          favoriteColor: req.body.favoriteColor,
          password: hash
        });

        //save the user to the database
        user.save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: "Added user to database",
              boolean: true
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      }
    })
    .catch(err => {
      res.status(500).json({
        error:err
      });
    });
});

module.exports = router;
