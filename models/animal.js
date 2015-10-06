// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Animal', new Schema({
	id: String,
	managedBy: String,
	name: String,
	type: String,
	breed: String,
	date: Date,
	latestWeight: Number	
}));