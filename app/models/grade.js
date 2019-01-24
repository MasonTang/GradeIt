const mongoose = require('mongoose');
const User = require('./user')
mongoose.Promise = global.Promise;

const gradeSchema = mongoose.Schema({
        className: String,
        assignment: String,
        grades: Number,
        weight: Number,
        desiredGrade: Number,
        semester: String,
        userID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
},{
    usePushEach:true
})

gradeSchema.pre('find', function (next) {
    this.populate('userID')
    next();
})

gradeSchema.pre('findOne', function (next) {
    this.populate('userID')
    next();
})

gradeSchema.virtual('name').get(function(){
    return `${this.userID.local.email}`
})

gradeSchema.virtual('averageGrade').get(function(){
    return `${this.grades * this.weight}`
})

gradeSchema.virtual('desiredGradeOutput').get(function(){
    return `${this.grades * this.weight}`
})

gradeSchema.methods.serialize = function(){
    return {
        id: this._id,
        className: this.className,
        assignment: this.assignment,
        grades: this.grades,
        weight: this.weight,
        desiredGrade: this.desiredGrade,
        desiredGradeOutput: this.desiredGradeOutput,
        finalGrade: this.averageGrade,
        semester:this.semester,
        userID:this.name
    }
}


module.exports = mongoose.model('Grade', gradeSchema);