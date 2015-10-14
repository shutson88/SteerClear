// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('AnimalType', new Schema({
	type: {
        type: String,
        required: true,
		unique: true,
		lowercase: true
    },

	breeds: [
		{
			_id:false,
			breed: {type: String, lowercase: true, unique: true}		
		}
	
	
	]
}));
