// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('AnimalType', new Schema({
	type: {
        type: String,
        required: true
    },
	breed: {
		type: String[],
		required: true,
	}
}));
