const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
	{
		name :{type : String, required : true},
		price :{type : Number, required : true, min :0},
		image : String,
		description: String,
		veg : {type : Boolean, default : true},
		isAvailable:{type : Boolean, default : true},
	},
		{ _id : true, timestamps : true }

);
const resturantSchema = new mongoose.Schema(
	{
		name :{type : String, required : true},
		image : String,
		cusine : {type : String, required : true},
		rating : {type : Number, default : 3, min :0, max:5 },
		address : {type : String},
		deliveryTimeMins : {type : Number, default : 30},
		menu :[menuItemSchema],
		isActive : {type : Boolean, default : true}
	},
	{timestamps:true}
);

const Resturant = mongoose.model('Resturant', resturantSchema);
module.exports = Resturant;
