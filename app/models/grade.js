const mongoose = require('mongoose');

const gradeSchema = mongoose.Schema({
        className: String,
        assignment: String,
        grade: Number,
        weight: Number,
        desiredGrade: Number,
        finalGrade:Number,
        semester: String
})

/*
gradeSchema.virtual('averageGrade') = mongoose.Schema({
       return `${this.grade} * ${this.weight}`
})
*/

module.exports = mongoose.model('Grade', gradeSchema);