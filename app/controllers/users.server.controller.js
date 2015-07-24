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
exports.listTags = function(req, res) {
    res.send(req.user.tags);
};
exports.read = function(req, res) {
    res.json(req.user);
};

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

exports.addTags = function(req, res) {
    console.log(req.user.tags);//这是正常的
    var tags = req.body.tags.split(",");
    for (var i in tags) {
        req.user.tags.addToSet(tags[i]);//这个报错,ubdefined
    };
    req.user.save(function(err) {
        if (err) {
            res.send("添加用户级tag失败!");
        } else {
            //res.send('更新数据成功!');
            res.send('添加用户级tag成功');
        };
    });
}



/*
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
};*/
exports.requiresLogin = function(req, res, next) {
    if (!req.user) {
        return res.status(401).send({
            message: 'User is not logged in1111'
        });
    }
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
                profile.user_name = 'user/'+profile.login;
                profile._id = profile.id;
                profile.accessToken = accessToken;
                done(null, profile);
            });
        },
        function(profile, done) {
            request({
                url: 'https://api.github.com/users/' + profile.username + '/starred?per_page=100',
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            }, function(error, response, repositories) {
                repositories = JSON.parse(repositories);
                for (i in repositories) {
                    repositories[i]._id = repositories[i].id;
                    delete repositories[i].owner.url;
                    delete repositories[i].owner.gravatar_id;
                    delete repositories[i].owner.followers_url;
                    delete repositories[i].owner.following_url;
                    delete repositories[i].owner.gists_url;
                    delete repositories[i].owner.starred_url;
                    delete repositories[i].owner.subscriptions_url;
                    delete repositories[i].owner.organizations_url;
                    delete repositories[i].owner.repos_url;
                    delete repositories[i].owner.events_url;
                    delete repositories[i].owner.received_events_url;
                    delete repositories[i].owner.site_admin;
                }
                profile.repositories = repositories;
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
    console.time('series');
    request({
        url: 'https://api.github.com/users/' + req.user.username + '/starred?per_page=100',
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    }, function(error, response, repos) {
        console.timeEnd('series');
        console.time('series1');
        repos = JSON.parse(repos);
        for (var i in repos) {
            repos[i]._id = repos[i].id;
            delete repos[i].id;
            req.user.repositories.addToSet(repos[i]);
        };
        req.user.save(function(err) {
            if (err) {
                res.send("更新数据失败!");
            } else {
                //res.send('更新数据成功!');
                res.redirect('/');
            };
            console.timeEnd('series1');
        });

    });
};
