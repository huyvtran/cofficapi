const mongoose = require('mongoose');

const subscriptionOrderSchema = mongoose.Schema({
	_id		     : mongoose.Schema.Types.ObjectId,
	plan_id   	 :  String,
	user_id 	 :  String,
	maxCheckIns	 :  Number,
	startDate	 :  Date,
	endDate		 :  Date,
	paymentId 	 :  String,
	status 		 :  String,
	id           :  String,
	billnumbers  :  String,
	createdBy 	 :  String,
	createdAt 	 :  Date,
});

module.exports = mongoose.model('subscriptionOrder',subscriptionOrderSchema);
