const mongoose = require('mongoose');

const cafeMenuSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
	itemName 		        : String,
	cost    				: Number,
	workspaceID 			: String,

});

module.exports = mongoose.model('cafeMenu',cafeMenuSchema);
