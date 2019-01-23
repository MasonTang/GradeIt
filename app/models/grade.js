const mongoose = require('mongoose');
80

mongoose.Promise = global.Promise;

const gradeSchema = mongoose.Schema({
        className: String,
        assignment: String,
        grades: Number,
        weight: Number,
        desiredGrade: Number,
        semester: String
},{
    usePushEach:true
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
        semester:this.semester
    }
}


module.exports = mongoose.model('Grade', gradeSchema);