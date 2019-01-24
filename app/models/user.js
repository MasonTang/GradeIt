const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');


mongoose.Promise = global.Promise;

//define the schema for our user model
const userSchema = mongoose.Schema({
    local :{
        email: String,
        password: String
    },
    allGrades: [{type: mongoose.Schema.Types.ObjectId, ref:'Grade'}]
},{
    usePushEach:true
});

userSchema.pre('find', function(next){
    this.populate('allGrades')
    next();
})

userSchema.pre('findOne', function (next) {
    this.populate('allGrades')
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
module.exports = mongoose.model('User', userSchema);
