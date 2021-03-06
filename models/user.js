var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var userSchema = mongoose.Schema({
	fullname:{type: String,required: true},
	email:{type: String, default:''},
	age:{type: String,default: ''},
	address:{type: String, default: ''},
	password:{type: String},
	role:{type: String, default:''},
	company:{
		name:{type: String, default: ''},
		image:{type: String, default: ''}
	},
    	google: {type: String, default: ''},
	twitter: {type: String, default: ''},
	passwordResetToken:{type: String, default: ''},
	passwordResetExpires:{type: Date, default: Date.now},

});
userSchema.methods.encryptPassword = (password) =>{
	return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}
userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password,this.password);
};
module.exports = mongoose.model('User',userSchema);
