const mongoose = require('mongoose');
const Grade = require('./grade')
const User = require('./user')
mongoose.Promise = global.Promise;

const semesterSchema = mongoose.Schema({
    className: String,
    assignment: String,
    grades: [Number],
    weight: [Number],
    desiredGrade: Number,
    semesterName: String,
})

const Semester = mongoose.model("Semester", semesterSchema)
module.exports = { Semester }