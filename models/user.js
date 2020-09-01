const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    username: String,
    firstName: String,
    lastName: String,
    favoriteColor: String,
    password: String
});

module.exports = mongoose.model('User', userSchema);