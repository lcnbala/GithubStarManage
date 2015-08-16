'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    passport = require('./config/passport'),
    db = mongoose(),
    app = express(),
    passport = passport();

app.listen(4000);
console.log('Server running at http://localhost:3000/');
module.exports = app;
