// Invoke 'strict' JavaScript mode
'use strict';
var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');
module.exports = function(app) {
    app.get('/signout', users.signout)
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
        .get(users.requiresLogin, users.listUsers);
    app.route('/user/:userId')
        .post(users.addUserTags)
        .get(users.requiresLogin, users.read);
    app.route('/user/:userId/addRemarkAndTag')
        .post(users.addRemarkAndTag);
    app.route('/user/:userId/starred')
        .get(users.requiresLogin, users.listStarred);
    app.route('/user/:userId/listUserTags')
        .get(users.requiresLogin, users.listUserTags);
    app.route('/user/:userId/updateStarred')
        .post(users.requiresLogin, users.updateStarred);
    app.param('userId', users.userByUsername);
};
