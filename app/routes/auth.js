module.exports = function(app,passport) {
    //process the login form
    //app.post('/login', do all our passport stuff here);

    //process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/semester',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/semester',
        failureRedirect: '/login',
        failureFlash: true
    }));

    //logout
    app.get('/logout', function(req,res){
        req.logout();
        res.redirect('/');
    })
}

//middleware to detect login
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next();

    res.redirect('/')
}