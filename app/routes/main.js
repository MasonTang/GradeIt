module.exports = function (app, passport) {
    const express = require("express");
    const mongoose = require('mongoose');
    const {User} = require('../models/user');
    const {Class} = require('../models/class');
    const {Semester} = require('../models/semester');
    const {Assignment} = require('../models/assignment');
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const session = require('express-session');
    const flash = require('req-flash');
    
    app.use(bodyParser.json()); //get information from html forms
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.json());

    app.set('view engine', 'ejs')
    app.use(cookieParser());
    app.use(session({ secret: '123' }));
    app.use(flash());
////////////////////////////////////////////////
//TESTING ROUTES
///////////////////////////////////////////////
    app.get('/', (req, res) => {
        res.render('index.ejs', {user:req.user})
    });

    //show the login form
    app.get('/login', (req, res) => {
        res.render('login.ejs', { message: req.flash('loginMessage') })    
    });

    //show the signup form
    app.get('/signup', (req, res) => {
        res.render('signup', { message: req.flash('signupMessage') })    
    });


    app.get('/google3f6af55c51fcf92e.html', (req, res) => {
        res.render('google3f6af55c51fcf92e.html')
        
    });

    //users
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

/////////////////////////
    //Semester
////////////////////////////////////////

    //show semester form
    app.get('/semester', isLoggedIn, (req, res) => {
        Semester
            .find({ user: req.user._id })
            .then(result => {
                res.render('semester', { user: req.user, semesters: result })
            })
            .catch(errorHandler);
    });

    app.post('/api/semester', function (req, res) {
        const requiredFields = ['semester']
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
        }

        Semester
            .create({
                semester: req.body.semester,
                user: req.user._id,
            })
            .then(semester => {
                res.redirect('/semester')
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Something went wrong' })
            })
                    
        })

    app.put('/api/semester', function (req, res) {
        const updated = {};
        const updateableFields = ['semester'];
        updateableFields.forEach(field => {
            //so its saying {}.className for updated[field]
            //req.body.className
            //updated now becomes req.body
            if (field in req.body) {
                updated[field] = req.body[field];
            }
        })

        Semester
            .findByIdAndUpdate(req.user._id, { $set: updated }, { new: true })
            .then(updatedSemester => res.status(200).json({
                semester: updatedSemester.semester
            }))
            .catch(err => res.status(500).json({ message: "Internal server error" }))
    });
      

    app.delete('/api/semester', function (req, res) {
        Semester
            .findByIdAndRemove(req.body.semesterId)
            .then((semester) => res.status(204).end())
            .catch(err => res.status(500).json({message:"Internal server error"}))
    })

/////////////////////////
//Class
////////////////////////////////////////

    app.get('/class/:semesterId', isLoggedIn, function (req, res) {
        Semester
            .findOne({_id:req.params.semesterId})
            .then(semesters => {
                if(semesters){
                    Class
                        .find({ semester: req.params.semesterId })
                        .then(results => {
                            res.render('class', { classes: results, semester: semesters })
                        })
                }
            })
    })

    app.post('/class/:semesterId', function (req, res) {
        const requiredFields = ['class']
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
        }

        Class
            .create({
                class: req.body.class,
                semester: req.params.semesterId
            })
            .then(() => {
                Class
                .findOne({semester:req.params.semesterId})
                .then((classes) => {
                    res.redirect(`/class/${classes.semester._id}`)
                })
                
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Something went wrong' })
            })
        })

app.put('/class/:classId', function (req, res) {
    const updated = {};
    const updateableFields = ['class'];
    updateableFields.forEach(field => {
        //so its saying {}.className for updated[field]
        //req.body.className
        //updated now becomes req.body
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    })

    Class
        .findByIdAndUpdate(req.params.classId, { $set: updated }, { new: true })
        .then(updatedClass => res.status(200).json({
            class: updatedClass.class
        }))
        .catch(err => res.status(500).json({ message: "Internal server error" }))
    });


app.delete('/api/class', function (req, res) {
    Class
        .findByIdAndRemove(req.body.classId)
        .then((classes) => res.status(204).end())
        .catch(err => res.status(500).json({ message: "Internal server error" }))
})

/////////////////////////
//Assignment
////////////////////////////////////////

app.get('/assignment/:classId', isLoggedIn, function (req, res) {

    Class
        .findOne({_id:req.params.classId})
        .then(classes => {
            if(classes){
                Assignment
                    .find({class:req.params.classId})
                    .then(assignments => {
                    
///////////////////////////////
//// Calculate Average Grade
//////////////////////////////////////////////////////
                        const totalGrades = [0];
                        const arrayWeight = [0];
                        const arrayGrade = [0];
                        const sum = (a, b) => parseInt(a) + parseInt(b);
                        const weights = assignments.forEach(function(assignment){
                            arrayWeight.push(assignment.weight)
                        })
                        const grades = assignments.forEach(function (assignment) {
                            arrayGrade.push(assignment.grade)
                        })
                        const totalWeight = arrayWeight.reduce(sum);
                        for(let i = 0; i < arrayGrade.length; i++){
                            totalGrades.push(arrayWeight[i] * arrayGrade[i])
                        }
                        const sumMultGradeWeight = totalGrades.reduce(sum);
                        let finalGrade = (sumMultGradeWeight / totalWeight).toFixed(2);

                        if(finalGrade === "NaN"){
                            finalGrade = '0';
                        }
                        

                        res.render('assignment', {
                            classe:classes, 
                            assignment:assignments,
                            finalGrade: finalGrade
                        })
                    })
            }
        })
        .catch('Something went wrong');
})

app.post('/assignment/:classId', function (req, res) {
    const requiredFields = ['assignment','weight', 'grade']
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
        Assignment
            .create({
                assignment: req.body.assignment,
                weight: req.body.weight,
                grade:req.body.grade,
                class: req.params.classId,
            })
            .then(() => {
                Assignment
                .findOne({class:req.params.classId})
                .then(assignments => { 
                    res.redirect(`/assignment/${assignments.class._id}`)
                })
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Something went wrong' })
            })
        })

    app.delete('/api/assignment', function (req, res) {
        Assignment
            .findByIdAndRemove(req.body.assignmentId)
            .then(() => res.status(204).end())
            .catch(errorHandler)
    })

}
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