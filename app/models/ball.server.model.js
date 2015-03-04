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
			type: Number
		},
		max: {
			type: Number
		},
		avg: {
			type: Number
		}
	}, 
	benchmarks : [
		{
			source: {
				type: String,
				trim: true	
			}, 
			price : {
				type : Number
			}, 
			freeSleeve : {
				type: Boolean,
				required : false
			}, 
			url : {
				type : String,
				trim : true
			},
			ball : {
				type : Schema.Types.ObjectId
			},
			_id : { 
				type : Schema.Types.ObjectId, 
				required : false, 
				turnOn: false 
			}
		}
	],
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
	minSpeed : {
		type: Number,
		default: 0
	},
	maxSpeed : {
		type: Number,
		default: 999
	},
	compression : {
		type: Number
	},
	handicap : [
		String
	],
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
	women : {
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