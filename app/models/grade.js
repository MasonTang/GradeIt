const mongoose = require('mongoose');
const User = require('./user')
mongoose.Promise = global.Promise;

const gradeSchema = mongoose.Schema({
        className: String,
        assignment: [String],
        grades: [Number],
        weight: [Number],
        desiredGrade: Number,
        semester: String,
        user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

gradeSchema.pre('find', function(next){
    this.populate('user')
    next();
})

gradeSchema.pre('findOne', function (next) {
    this.populate('user')
    next();
})

gradeSchema.virtual('username').get(function() {
    return `${this.user}`
})

gradeSchema.virtual('averageGrade').get(function(){
    return `${this.grades * this.weight}`
})

gradeSchema.virtual('desiredGradeOutput').get(function(){
    return `${this.grades * this.weight}`
})

gradeSchema.methods.seralize = function(){
    return {
        user: this.user,
        className: this.className,
        assignment: this.assignment,
        grades: this.grades,
        weight: this.weight,
        desiredGrade: this.desiredGrade,
        desiredGradeOutput: this.desiredGradeOutput,
        finalGrade: this.averageGrade,
        semester:this.semester,
    }
}

const Grade = mongoose.model("Grade", gradeSchema)
module.exports = {Grade}