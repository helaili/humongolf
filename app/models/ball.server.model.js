'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ball Schema
 */
var BallSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Ball name',
		trim: true
	},
	brand: {
		type: String,
		default: '',
		required: 'Please fill Ball brand',
		trim: true
	},
	fullname: {
		type: String,
		default: '',
		required: 'Please fill full name',
		trim: true
	},
	price : {
		min: {
			type: Number,
			required: 'Please fill minimum price',
			trim: true
		},
		max: {
			type: Number,
			required: 'Please fill maximum price',
			trim: true
		},
		avg: {
			type: Number,
			required: 'Please fill average price',
			trim: true
		}
	},
	images : {
		small : {
			type: String,
			trim: true
		},
		large : {
			type: String,
			trim: true
		}
	},
	description: {
		type: String,
		trim: true
	},
	published : {
		type: Boolean,
		default: false
	},
	pieces : {
		type: Number
	},
	recycled : {
		type: Boolean,
		default: false
	},
	highNumber : {
		type: Boolean,
		default: false
	},
	customizable : {
		type: Boolean,
		default: false
	},
	color : {
		type: String,
		default: 'White',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Ball', BallSchema);