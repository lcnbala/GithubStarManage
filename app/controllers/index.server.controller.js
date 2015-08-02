exports.render = function(req, res) {
    if (req.user) {
        if (req.session.lastVisit) {
            console.log(req.session.lastVisit);
        }
        req.session.lastVisit = new Date();
        res.render('index', {
            title: req.user.username,
            user: JSON.stringify(req.user)
        });
    } else {
        res.render('home');
    }
};
