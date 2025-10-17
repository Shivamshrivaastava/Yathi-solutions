const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
	{
		name: {type : String, required:true, trim: true},
		email :{type : String, required : true},
		password :{type :String, required : true, minLength :6},
		role: {type : String, enum : ['user', 'admin'], defaut : 'user'}
	}, 
	{timestamps : true}
);
UserSchema.pre('save', async function(next) {
	if(!this.isModified('password')) return next();
	const salt = await bcrypt.genSalt(8);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods.matchPassword = async function(entered) {
	return bcrypt.compare(entered, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
