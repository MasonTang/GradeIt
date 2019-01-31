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
        console.log('profile')
        res.render('profile', {user:req.user})
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

    app.delete('/grades/:gradeId', (req,res) => {
        Grade
            .findByIdAndRemove(req.params.gradeId)
            .then((grade) => res.status(204).end())
            .catch(err => res.status(500).json({message:"Internal server error"}))
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
    app.get('/grades/:userId', (req, res) => {
        Grade
            .find({ user: req.params.userId })
            .then(result => res.send(result))
            .catch(errorHandler);
    });



    // app.put('/grades/:gradeId', (req, res) => {
    //     //grab the information in the body
    //     const grades = {
    //         className: req.body.className,
    //         assignment: req.body.assignment,
    //         grades: req.body.grades,
    //         weight: req.body.weight,
    //         desiredGrade: req.body.desiredGrade,
    //         semester: req.body.semester,
    //         finalGrade:req.body.finalGrade,
    //         gradeId:uuid()
    //     }
    //     //find the user by the id and push the grades information in it
    //     User.findById(req.params.userId)
    //         .then(user => {
    //             console.log(user)
    //             //user.grades.push(grades)

    //             Grade.save(err => {
    //                 if(err){
    //                     res.send(err)
    //                 }
    //                 res.json(user)
    //             })
    //         })
    // })
//edit individual grades
    app.put('/grades/:gradeId', (req, res) => {
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

        Grade
            .findByIdAndUpdate(req.params.gradeId, {$set: updated}, {new:true})
            .then(updatedGrade => res.status(200).json({
                id: updatedGrade.id,
                className: updatedGrade.className,
                assignment:updatedGrade.assignment,
                grades:updatedGrade.grades,
                weight:updatedGrade.weight,
                semester:updatedGrade.semester
            }))
            .catch(err => res.status(500).json({message:"Internal server error"}))
    });

    app.put('/users/:userId', (req, res) => {
        //it first checks if there is a req.params.id and if there is a req.body.id
        //next it checks if the are equal.
        //! if all it is not true than return an error

        const updated = {};
        const updateableFields = ['username', 'password'];
        updateableFields.forEach(field => {
            //so its saying {}.className for updated[field]
            //req.body.className
            //updated now becomes req.body
            if (field in req.body) {
                updated[field] = req.body[field];
            }
        })

        User
           .findById(req.params.userId, (err, user) => {
                user.local.username = req.body.username;
                user.local.password = req.body.password;
                user.save()
                res.json(user)
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

