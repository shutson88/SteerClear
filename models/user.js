// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({

    _id:
    {
        type: String,
        required: true,
        lowercase: true
    },

    password:
    {
        type: String,
        required: true
    },

    first_name: String,

    last_name: String,

    email:
    {
        type: String,
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        unique: true,
        required: true,
		lowercase: true
    },

	admin:
	{
		type: Boolean,
		required: true,
		default: false

	},

	observing: [
		{
			_id: false,
			username: String,
		}
	],

	observedBy: [
		{
			_id: false,
			username: String,
		}
	],

	resetPasswordToken: String,
	resetPasswordExpires: Date,

    date_created:
    {
        type: Date,
        required: true,
        default: Date.now
    },

    notifications:[
    {
        _id:false,
        sender: {
            type:String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }]
}));
