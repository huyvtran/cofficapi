const mongoose = require('mongoose');

const seatBookingPlanSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    user_id 					 :  String,
	workSpace_id				 :  String,
	subscriptionPlanID		     :  String,
	date 						 :  Date,
	checkInTime	 				 :  Date,
	checkOutTime 				 :  Date,
	createdBy 	 				 :  user_id,
	createdAt 		 			 :  Date,	

});

module.exports = mongoose.model('seatBooking',seatBookingSchema);
