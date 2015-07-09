exports.render = function(req, res) {
    if (req.session.lastVisit) {
        console.log(req.session.lastVisit);
    }
    req.session.lastVisit = new Date();
    var ti = req.user.username;
    res.render('index', {
        title: ti,
        user: JSON.stringify(req.user.username)
    });
};
