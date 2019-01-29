//expose this function to our app using module.exports
module.exports = function(passport) {

    //load up all the things we need
    var LocalStrategy = require('passport-local').Strategy;

    //load up the user model
    var {User} = require('../app/models/user');
    //passport needs to serialize and unserialize users out of session 

    //used to serialize the user for the session
    //done. if the credientials are valid than the verify callback invokes done to supply Passport with the user that authenticated
    //user information wil get stored inside jwt token
    //when it is serialized it is not readable in human form
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //used to deserialize the user
    //extracts the user information and knows who is logged in
    passport.deserializeUser(function (id, done) {
        User.findById(id, function(err,user) {
            done(err,user);
        });
    });

    // ===============================================================
    // LOCAL SIGNUP =================================================
    // ========================================
    // WE ARE USING NAMED STRATEGIES SINCE WE HAVE ONE FOR LOGIN AND ONE for signup

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, username, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            //to schedule a callbackfunction to be invoked in the next iteration of the Event Loop, we use process.nextTick()
            process.nextTick(function () {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'local.username': username }, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    //
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {

                        // if there is no user with that email
                        // create new user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.local.username = username;
                        newUser.local.password = newUser.generateHash(password);

                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));
        
};
