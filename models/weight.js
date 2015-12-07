// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Weight', new Schema({
	// ID of the animal weighed
	id: {
		type: String,
		required: true,
		lowercase: true
	},
	weight: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true
	}

}));
