var User = require('mongoose').model('User'),
    passport = require('passport'),
    request = require('request'),
    async = require('async');


var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].
            message;
        }
    }
    return message;
};


exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.listUsers = function(req, res, next) {
    User.find({}, /*'username email',*/ function(err, users) {
        if (err) {
            return next(err);
        } else {
            res.json(users);
        }
    });
};
exports.listStarred = function(req, res) {
    res.send(req.user.repositories);
};
exports.read = function(req, res) {
    res.json(req.user);
};
/*
exports.userByID = function(req, res, next, _id) {
    User.findOne({
        _id: _id
    }, function(err, user) {
        if (err) {
            return next(err);
        } else {
            req.user = user;
            next();
        }
    });
};*/
exports.userByUsername = function(req, res, next, username) {
    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            return next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

exports.update = function(req, res, next) {
    User.findByIdAndUpdate(req.user._id, req.body, function(err, user) {
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
};
exports.delete = function(req, res, next) {
    req.user.remove(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.user);
        }
    })
};
exports.requiresLogin = function(req, res, next) {
    if (!req.user) {
        return res.status(401).send({
            message: 'User is not logged in1111'
        });}
    next();
};
exports.LinkToGithub = function(req, accessToken, done) {
    async.waterfall([
        function(done) {
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
                done(null, profile);
            });
        },
        function(profile, done) {
            request({
                url: 'https://api.github.com/users/' + profile.username + '/starred?per_page=10000',
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            }, function(error, response, repositories) {
                profile.repositories = JSON.parse(repositories);
                done(null, profile);
            });
        }
    ], function(error, profile) {
        User.findOne({
            _id: profile._id
        }, function(err, user) {
            // If an error occurs continue to the next middleware
            if (err) {
                return done(err);
            } else {
                // If a user could not be found, create a new user, otherwise, continue to the next middleware
                if (!user) {
                    // Set a possible base username
                    var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');

                    // Find a unique available username
                    User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                        // Set the available user name
                        profile.username = availableUsername;

                        // Create the user
                        user = new User(profile);

                        // Try saving the new user document
                        user.save(function(err) {
                            // Continue to the next middleware
                            return done(err, user);
                        });
                    });
                } else {
                    // Continue to the next middleware
                    return done(err, user);
                }
            }
        });
    })

};
exports.updateStarred = function(req, res) {
    request({
        url: 'https://api.github.com/users/' + req.user.username + '/starred?per_page=10',
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    }, function(error, response, repositories) {
        var message = "";
        repositories = JSON.parse(repositories);
        res.end(repositories[1].id+repositories[1].name);
        for(repo in repositories){
            message += repo;
        }
        //res.send(message);
    });
};