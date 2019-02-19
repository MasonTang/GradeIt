const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;

//define the schema for our user model
const userSchema = mongoose.Schema({
    local :{
        username: String,
        password: String
    }
},{
    usePushEach:true
});

//methods ==================
//generating a  hash
userSchema.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
};

//checking if password is valid
userSchema.methods.validPassword = function (password){
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
const User = mongoose.model("User", userSchema)
module.exports = { User }
