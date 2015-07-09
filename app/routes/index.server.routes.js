// Invoke 'strict' JavaScript mode
'use strict';

module.exports = function(app) {
    var index = require('../controllers/index.server.controller');
    app.use('/dd', function(req, res) {
        res.end('<html><body><a href="https://github.com/login/oauth/authorize?client_id=4c4ff12d4ea2e9212252&scope=repo">oauth2</a></body></html>');
    });
    app.get('/', index.render);
};
