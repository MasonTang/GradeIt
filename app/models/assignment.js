const mongoose = require('mongoose');
const Class = require('./class')
mongoose.Promise = global.Promise;

const assignmentSchema = mongoose.Schema({
    assignment: String,
    grade: Number,
    weight: Number,
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
})

assignmentSchema.pre('find', function (next) {
    this.populate('class')
    next();
})

assignmentSchema.pre('findOne', function (next) {
    this.populate('user')
    next();
})

assignmentSchema.methods.seralize = function () {
    return {
        assignment: this.assignment,
        grade: this.grade,
        weight: this.weight,
        class: this.class
    }
}

const Assignment = mongoose.model("Assignment", assignmentSchema)
module.exports = { Assignment }