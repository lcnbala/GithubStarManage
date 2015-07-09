// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var passport = require('passport'),
    mongoose = require('mongoose');

// Define the Passport configuration method
module.exports = function() {
    // Load the 'User' model
    var User = mongoose.model('User');

    // Use Passport's 'serializeUser' method to serialize the user id
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // Load Passport's strategies configuration files
    require('./strategies/github.js')();
};
