const mongoose = require('mongoose');

const projectSettingsSchema = mongoose.Schema({
	_id			: mongoose.Schema.Types.ObjectId,
    type        : String,
    key         : String,
    secret      : String,
    bucket      : String,
    region      : String,
    authID 		: String,
    authToken 	: String,

    plivokey    : String,
    plivosecret : String,
    source      : String,
});

module.exports = mongoose.model('projectSettings',projectSettingsSchema);
