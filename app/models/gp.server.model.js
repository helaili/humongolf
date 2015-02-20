'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Gp Schema
 */
var GpSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Gp name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Gp', GpSchema);