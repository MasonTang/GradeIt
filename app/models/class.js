const mongoose = require('mongoose');
const User = require('./user')
const Semester = require('./semester')
mongoose.Promise = global.Promise;

const classSchema = mongoose.Schema({
    class: String,
    semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

classSchema.pre('find', function (next) {
    this.populate('user')
    next();
})

classSchema.pre('findOne', function (next) {
    this.populate('user')
    next();
})

classSchema.pre('find', function (next) {
    this.populate('semester')
    next();
})

classSchema.pre('findOne', function (next) {
    this.populate('semester')
    next();
})

classSchema.methods.seralize = function () {
    return {
        semester: this.semester,
        class: this.classId,
    }
}

const Class = mongoose.model("Class", classSchema)
module.exports = { Class }