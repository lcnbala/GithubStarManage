var User = require('mongoose').model('User'),
    ObjectId = require('mongoose').Schema.Types.ObjectId,
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
exports.listUserTags = function(req, res) {
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

exports.addUserTags = function(req, res) {
    var tags = req.body.tags.split(",");
    for (var i in tags) {
        req.user.tags.addToSet(tags[i]);
    };
    req.user.save(function(err) {
        if (err) {
            res.send("添加用户级tag失败!请向开发者报告此消息。谢谢支持。");
        } else {
            //res.send('更新数据成功!');
            res.send('<meta http-equiv="refresh" content="1;url=https://github.com/login/oauth/authorize?client_id=4c4ff12d4ea2e9212252&scope=repo">添加用户级tag成功，3秒后将跳转回首页，或点击链接<a href="https://github.com/login/oauth/authorize?client_id=4c4ff12d4ea2e9212252&scope=repo">返回首页</a>');
        };
    });
};

//<meta http-equiv="refresh" content="1;url=https://github.com/login/oauth/authorize?client_id=4c4ff12d4ea2e9212252&scope=repo">
exports.updateStarred = function(req, res) {
    if (req.body.page) {
        console.time('series');
        request({
            url: 'https://api.github.com/users/' + req.user.username + '/starred?per_page=100&page=' + req.body.page,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        }, function(error, response, repos) {
            console.timeEnd('series');
            console.time('series1');
            repos = JSON.parse(repos);
            for (var i in repos) {
                req.user.repositories.addToSet(repos[i]);
            };
            req.user.save(function(err) {
                if (err) {
                    res.send("更新数据失败!");
                } else {
                    res.send('<meta http-equiv="refresh" content="1;url=https://github.com/login/oauth/authorize?client_id=4c4ff12d4ea2e9212252&scope=repo">更新数据成功!3秒后将跳转回首页，或点击链接<a href="https://github.com/login/oauth/authorize?client_id=4c4ff12d4ea2e9212252&scope=repo">返回首页</a>');
                    //res.redirect('/');
                };
                console.timeEnd('series1');
            });

        });
    };
};
exports.addRemarkAndTag = function(req, res) {
    for (var _id in req.body) {
        //console.log(_id);
        if (_id != 'tag' && _id != '_ids') {
            if (req.body[_id]) {
                User.update({
                    "repositories._id": _id
                }, {
                    $set: {
                        "repositories.$.remark": req.body[_id]
                    }
                }, function(err, result) {});
            };
        } else {
            var _ids = req.body._ids,
                tag = req.body.tag;
            for (var i in _ids) {
                User.update({
                    "repositories._id": _ids[i]
                }, {
                    $addToSet: {
                        "repositories.$.tags": tag
                    }
                }, function(err, result) {});
            };
        };
    }
    res.send('<meta http-equiv="refresh" content="1;url=https://github.com/login/oauth/authorize?client_id=4c4ff12d4ea2e9212252&scope=repo">添加tag及remark成功，3秒后将跳转回首页，或点击链接<a href="https://github.com/login/oauth/authorize?client_id=4c4ff12d4ea2e9212252&scope=repo">返回首页</a>');
};
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
                profile.user_name = 'user/' + profile.login;
                profile.updateStarred = 'user/' + profile.login + '/updateStarred';
                //profile.addRemarkAndTag = 'user/' + profile.login + '/addRemarkAndTag';
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
                // for (i in repositories) {
                //     delete repositories[i].owner.url;
                //     delete repositories[i].owner.gravatar_id;
                //     delete repositories[i].owner.followers_url;
                //     delete repositories[i].owner.following_url;
                //     delete repositories[i].owner.gists_url;
                //     delete repositories[i].owner.starred_url;
                //     delete repositories[i].owner.subscriptions_url;
                //     delete repositories[i].owner.organizations_url;
                //     delete repositories[i].owner.repos_url;
                //     delete repositories[i].owner.events_url;
                //     delete repositories[i].owner.received_events_url;
                //     delete repositories[i].owner.site_admin;
                // };
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

