'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Featurette Schema
 */
var FeaturetteSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Featurette name',
		trim: true
	},
	position: {
		type: Number,
		default: 999
	},
	enabled: {
		type: Boolean,
		default: false
	},
	heading: {
		type: String,
		default: '',
		required: 'Please fill Featurette title',
		trim: true
	},
	link: {
		type: String,
		default: '',
		required: 'Please fill Featurette link',
		trim: true
	},
	image: {
		type: String,
		default: '',
		required: 'Please fill Featurette image URL',
		trim: true
	},
	shortText: {
		type: String,
		default: '',
		required: 'Please fill Featurette short text',
		trim: true
	},
	longText: {
		type: String,
		default: '',
		required: 'Please fill Featurette long text',
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

mongoose.model('Featurette', FeaturetteSchema);