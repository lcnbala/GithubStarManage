// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var passport = require('passport'),
    url = require('url'),
    githubStrategy = require('passport-oauth2'),
    config = require('../config'),
    users = require('../../app/controllers/users.server.controller'),
    request = require('request');

// Create the github strategy configuration method
module.exports = function() {
    passport.use(new githubStrategy({
            authorizationURL: config.github.authorizationURL,
            tokenURL: config.github.tokenURL,
            clientID: config.github.clientID,
            clientSecret: config.github.clientSecret,
            callbackURL: config.github.callbackURL,
            passReqToCallback: true

        },
        function(req, accessToken, refreshToken, profile, done) {
            users.LinkToGithub(req, accessToken, done);
            /*
            request({
                url: 'https://api.github.com/users/golmic/starred',
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            }, function(error, response, repositories) {
                repositories = JSON.parse(repositories);
                request({
                    url: 'https://api.github.com/user?access_token=' + accessToken,
                    headers: {
                        'User-Agent': 'Mozilla/5.0'
                    }
                }, function(error, response, profile) {
                    profile = JSON.parse(profile);
                    profile.username = profile.login;
                    profile._id = profile.id;
                    profile.accessToken = accessToken;
                    profile.repositories = repositories;
                    users.saveUserProfile(req, profile, done);
                    //profile.repositories = ["a", "b", "c"];
                });
            });*/

        }));
};
