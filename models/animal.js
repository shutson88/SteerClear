// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Animal', new Schema({
	_id: {
		type: String,
		required: true,
		lowercase: true
	},
	managedBy: {
		type: String,
		required: true,
		lowercase: true
	},
	name: {
		type: String,
		required: true,
		lowercase: true
	},
	type: {
		type: String,
		required: true,
		lowercase: true
	},
	breed: {
		type: String,
		required: true,
		lowercase: true
	}
	
}));