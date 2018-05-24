var keystone = require('keystone');
var Types = keystone.Field.Types;
var moment = require("moment");

const { MONTHS, toCamelCase } = require('../lib/common');

/**
 * Certificate Model
 * ==========
 */
var Certificate = new keystone.List('Certificate');

Certificate.add({
	name: { type: Types.Text, initial: true, required: true},
	authority: { type: Types.Text, initial: true, required: true},
	licenseNumber: { type: Types.Text, initial: true},
	url: { type: Types.Text, initial: true},
	fromMonth: {type: Types.Select, options: MONTHS, initial: true},
	fromYear: { type: Types.Text, initial: true, required: false},
	doesNotExpire: { type: Boolean, initial: true, default: false },
	toMonth: {type: Types.Select, options: MONTHS, initial: true},
	toYear: { type: Types.Text, initial: true, required: false},
	duration: { type: Types.Text},
	startDate: { type: Types.Date, index: true},
}, 'verification', {
	isVerified: { type: Boolean, initial: true, default: false },
});

// Provide access to Keystone
/*Certificate.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});*/

// Model Hooks
Certificate.schema.pre('save', function (next) {
  this.name = toCamelCase(this.name);
  this.authority = toCamelCase(this.authority);

	this.startDate = moment({ year: this.fromYear}).format()
	this.duration = !this.doesNotExpire ?
		`${this.fromMonth}, ${this.fromYear} - ${this.toMonth}, ${this.toYear}` :
		`${this.fromMonth}, ${this.fromYear} - Present`
  next();
});

/**
 * Relationships
 */
//Certificate.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
Certificate.defaultColumns = 'name, authority, licenseNumber, doesNotExpire, isVerified';
Certificate.register();
