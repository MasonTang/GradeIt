module.exports = function (app, passport) {
    const express = require("express");
    const mongoose = require('mongoose');
    const {User} = require('../models/user');
    const {Grade} = require('../models/grade')
    const bodyParser = require('body-parser');
    const uuid = require('uuidv4')

    app.use(bodyParser.json()); //get information from html forms
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.json());

    app.set('view engine', 'ejs')
////////////////////////////////////////////////
//TESTING ROUTES
///////////////////////////////////////////////
    app.get('/', (req, res) => {
        res.render('index.ejs')
    });

    //show the login form
    app.get('/login', (req, res) => {
        res.render('login.ejs', { message: req.flash('loginMessage') })    
    });

    //show the signup form
    app.get('/signup', (req, res) => {
        res.render('signup', { message: req.flash('signupMessage') })    
    });

    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile')
    });

///////////////////////////////////////////////////////////////
//TESTING ROUTES IN DB FOR GRADE
/////////////////////////////////////
    app.get('/grades', (req, res) => {
        Grade
            .find()
            .then(result => res.send(result))
            .catch(errorHandler);
    });

    app.get('/grades/:id', (req, res) => {
        Grade
            .find({userID:req.params.id})
            .then(result => res.send(result))
            .catch(errorHandler);
    });

    app.post('/grades', (req,res) => {
        const requiredFields = ['className', 'assignment', 'grades', 'weight', 'semester','userId']
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
        }
        User
            .findById(req.body.userId)
            .then(user => {
                console.log(user)
                if(user){
                    Grade
                        .create({
                            className:req.body.className,
                            assignment: req.body.assignment,
                            grades: req.body.grades,
                            weight:req.body.weight,
                            semester: req.body.semester,
                            user: req.body.userId,
                            desiredGrade: req.body.desiredGrade
                        })
                        .then(grade => {
                            res.status(201).json(grade.seralize())
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).json({error:'Something went wrong'})
                        })
                }
                else{
                    const message = 'author not found';
                    console.error(message);
                    return res.status(400).send(message)
                }
            })   
    })

    app.delete('/grades/:userId/:gradeId', (req,res) => {
        User
            .findById(req.params.userId)
            .then((user) => {
                
                res.status(204).json({message:'success'})
            })
    })
    /////////////////////////
    //TESTING FOR USERS
    ////////////////////////////////////////
    app.get('/users', (req, res) => {
        User
            .find()
            .then(result => res.send(result))
            .catch(errorHandler)
    });


/////////////////////////
    //TESTING FOR Individual USERS
////////////////////////////////////////


    app.get('/grades/:userId', (req,res) => {
        User.findById(req.params.userId)
            .then(user => {
                console.log(user)
                res.send(user.grades)
            })
    })

    app.post('/grades/:userId', (req, res) => {
        //grab the information in the body
        const grades = {
            className: req.body.className,
            assignment: req.body.assignment,
            grades: req.body.grades,
            weight: req.body.weight,
            desiredGrade: req.body.desiredGrade,
            semester: req.body.semester,
            finalGrade:req.body.finalGrade,
            gradeId:uuid()
        }
        //find the user by the id and push the grades information in it
        User.findById(req.params.userId)
            .then(user => {
                user.grades.push(grades)

                user.save(err => {
                    if(err){
                        res.send(err)
                    }
                    res.json(user)
                })
            })
    })
//edit individual grades
    app.put('/grades/:userId/:gradeId', (req, res) => {
        //it first checks if there is a req.params.id and if there is a req.body.id
        //next it checks if the are equal.
        //! if all it is not true than return an error

        const updated = {};
        const updateableFields = ['className', 'assignment', 'grades', 'weight', 'semester'];
        updateableFields.forEach(field => {
            //so its saying {}.className for updated[field]
            //req.body.className
            //updated now becomes req.body
            if (field in req.body) {
                updated[field] = req.body[field];
            }
        })

        User
            .findOne({ _id: req.params.userId })
            .then(user => {
                console.log(user)
                user.grades = user.grades.map(grade => {
                    if(grade._id === req.params.gradeId){
                        grade = updated[field];
                    } 
                    return grade;
                })
                user.save().then(user => res.send(user))
            })

    })

    app.put('/users/:id', (req, res) => {
        //it first checks if there is a req.params.id and if there is a req.body.id
        //next it checks if the are equal.
        //! if all it is not true than return an error
        if (!(req.params.id && req.body.id && (req.params.id === req.body.id))) {
            res.status(400).json({
                error: `Request path id and request body id values must match`
            });
        }

        const updated = {};
        const updateableFields = ['email', 'password'];
        updateableFields.forEach(field => {
            //so its saying {}.className for updated[field]
            //req.body.className
            //updated now becomes req.body
            if (field in req.body) {
                updated[field] = req.body[field];
            }
        })

        User
            .findOne({ _id: req.params.id || '' })
            .then(() => {
                User
                    //the first paramater is id
                    //{$set} prevents you from overwitting all the information from that set
                    //{new:true} this returns the new updated document instead of the original one
                    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
                    .then(updatedUser => {
                        res.status(200).json({
                            "local": {
                                "email": updatedUser.email,
                                "password": updatedUser.password
                            },
                        })
                    })
                    .catch(err => res.status(500).json({ message: err }))
            })
    })

};





//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    //if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    //if they aren't redirect them to the home page
    else {
        res.redirect('/')
    }
}

//route middleware to make sure a user is logged in as an admin
function isAdmin(req, res, next) {

    //if user is authenticated in the session, carry on
    if (req.isAuthenticated() && req.user.level == 'admin') {
        return next();
    }
    //if they aren't redirect them to the home page
    else {
        res.redirect('/')
    }
}

function errorHandler(err){
    console.error(err);
}

/*
className: gradepost.className,
    assignment: gradepost.assignment,
        grade: gradepost.grade,
            weight: gradepost.weight,
                semester: gradepost.semester,
                    desiredGrade: gradepost.desiredGrade,
                        finalGrade: gradepost.finalGrade
*/


/*
    // ==================================================
    //HOME PAGE (with login links) ==============================
    //====================================================

    //load index.ejs file
    app.get('/', (req, res) => {
        res.render('index.ejs');
    });

    // ==========================================================
    // LOGIN =================================================
    // ===================================================

    // show login form
    app.get('/login', (req, res) => {
        //render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') })
    });

    //process the login form
    //app.post('/login, do all our passport stuff here)

    // ==========================================================
    // SIGNUP =================================================
    // ===================================================

    //show the signup form
    app.get('/signup', (req, res) => {
        //render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    //process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', //redirect to the secure profile section
        failureRedirect: '/signup', //redirect back to signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    //process the signup form
    //app.post('/signup', do passport stuff here)

    // ==========================================================
    // PROFILE SECTION =================================================
    // ===================================================

    //we want this protected so you have to be logged in to visit
    //we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });


    // ==========================================================
    // LOGOUT SECTION =================================================
    // ===================================================

    app.get('/logout', function (req, res) {
        //these two lines below terminate a login session
        //these are passport code
        req.logout();
        res.redirect('/');
    });
*/
    // =========================================================
    // My SECTION =================================================
    // ===================================================

    //home page