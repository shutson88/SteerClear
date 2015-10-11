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
        unique: true, // TODO: figure out why it is not actually forcing uniqueness
        required: true,
		lowercase: true
    },

    date_created:
    {
        type: Date,
        required: true,
        default: Date.now
    }
}));
