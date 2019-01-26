const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Grade = require('./grade')

mongoose.Promise = global.Promise;

//define the schema for our user model
const userSchema = mongoose.Schema({
    local :{
        email: String,
        password: String
    },
    grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' }
},{
    usePushEach:true
});

userSchema.pre('find', function (next) {
    this.populate('grade')
    next();
})

userSchema.pre('findOne', function (next) {
    this.populate('grade')
    next();
})

//methods ==================
//generating a  hash
userSchema.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
};

//checking if password is valid
userSchema.methods.validPassword = password => {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
const User = mongoose.model("User", userSchema)
module.exports = { User }
