exports.render = function(req, res) {
	if(req.user){
    if (req.session.lastVisit) {
        console.log(req.session.lastVisit);
    }
    req.session.lastVisit = new Date();
    res.render('index', {
        title: req.user.username,
        user: JSON.stringify(req.user.username)
    });}
  else{
  	res.send('<html><body><h1><a href="https://github.com/login/oauth/authorize?client_id=4c4ff12d4ea2e9212252&scope=repo">oauth2</a></h1></body></html>');
  }
};