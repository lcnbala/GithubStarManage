// Invoke 'strict' JavaScript mode
'use strict';
var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');
module.exports = function(app) {
    app.get('/oauth/github',
        passport.authenticate('oauth2', {
            scope: 'repo'
        })
    );
    app.get('/oauth/github/callback', passport.authenticate('oauth2', {
        failureRedirect: '/signin',
        successRedirect: '/'
    }));
    app.route('/users')
        .get(users.listUsers);
    app.route('/user/:userId')
        .get(users.read)
        .delete(users.delete);
    app.route('/user/:userId/starred')
        .get(users.listStarred);
    app.param('userId', users.userByID);
};
