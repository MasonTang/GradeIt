const express= require('express');
const app = express(); 
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const {DATABASE_URL, PORT, Test_DATABASE_URL} = require('./config/database.js');
const Grade = require('./app/models/grade');
const User = require('./app/models/user');

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); //log every request to the console
app.use(cookieParser()); //read cookies (needed for auth)
app.use(bodyParser.json()); //get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'))

//app.set('view engine', 'ejs'); //set up ejs for templating 

//required for passport
app.use(session({
    secret: 'thinkful',
    resave:true,
    saveUninitialized:true
    })); //secret session
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); //use connect-flash for flash message stored in session

//routes
require('./app/routes/main.js')(app, passport); //load our routes and pass in our app and fully configured passport
require('./app/routes/auth.js')(app, passport);
//launch
let server;

// this function connects to our database, then starts the server
function runServer(Test_DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(Test_DATABASE_URL, err => {
            if (err) {
                console.log(err)
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer(Test_DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };
//app.listen(PORT);
