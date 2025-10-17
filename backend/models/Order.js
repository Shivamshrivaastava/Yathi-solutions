const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema(
	{
		resturant : {type : mongoose.Schema.Types.ObjectId, ref : 'Resturant',required : true},
		itemId :{type : mongoose.Schema.Types.ObjectId, required : true},
		name : {type : String, required : true},
		price : {type : String, required : true, min : 0},
		quantity : {type : Number, required : true, min : 1}
	},
	{_id : false}
);

const orderSchema = new mongoose.Schema(
	{
		user : {type : mongoose.Schema.Types.ObjectId, ref :'User', required : true},
		items : [orderItemSchema],
		total : {type : Number, required:true, min:0},
		status : {type : String, enum : ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'], default : 'placed'},

	},
	{timestamps : true}
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order
