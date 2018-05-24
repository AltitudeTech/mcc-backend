var keystone = require('keystone');
var Types = keystone.Field.Types;


const { STATES, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * Company Model
 * ==========
 */
var Company = new keystone.List('Company', {
	track: true
});
Company.schema.set('usePushEach', true);


staffOptions = [
	{ value: "a", label: '0 - 1' },
	{ value: "b", label: '2 - 10' },
	{ value: "c", label: '11 - 50' },
	{ value: "d", label: '51 - 200' },
	{ value: "e", label: '201 - 500' },
	{ value: "f", label: '501 - 1000' },
	{ value: "g", label: '1,001 - 5,000' },
	{ value: "h", label: '5,001 - 10,000' },
	{ value: "i", label: '10,000+' },
]

Company.add({
	name: { type: String, required: true, index: true },
	email: { type: Types.Email, initial: true, index: true, required: true, unique: true, sparse: true },
	cacRegNo: { type: Types.Text, initial: true, index: true, required: true, unique: true, sparse: true },
	phone: { type: Types.Text, initial: true, index: true },
	logoUrl: { type: Types.Text, initial: true },
	website: { type: Types.Text, initial: true },
	address: { type: Types.Text, initial: true },
	stateOfResidence: {type: Types.Select, options: STATES, index: true},
	description: { type: Types.Text, initial: true },
	yearFounded: { type: Types.Number, initial: true, index: true },
	staffSize: {type: Types.Select, options: staffOptions},
	industry: { type: Types.Relationship, ref: 'Industry', many: false, initial: true },
	industries: { type: Types.Relationship, ref: 'Industry', many: true, initial: true },
	password: { type: Types.Password, initial: true, required: true },
	passwordVersion: { type: Types.Text, initial: false, required: true, default: 1},
}, 'Jobs', {
	jobs: { type: Types.Relationship, ref: 'Job', many: true },
}, 'Status', {
	isActive: {type: Boolean, default: false, index: true},
	isVerified: {type: Boolean, default: false, index: true},
});

// Provide access to Keystone
/*Company.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});*/


/**
 * Relationships
 */
//Company.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

Company.schema.pre('save', function (next) {
  this.name = toCamelCase(this.name);
	if (this.phone) {
		if (PHONE_REGEX.test(this.phone)){
			next();
		} else {
			next(new Error('Invalid Phone Number'));
		}
	} else {
		next();
	}
	console.log(this);
});

/**
 * Registration
 */
Company.defaultSort = '-createdAt';
Company.defaultColumns = 'name, phone, email, cacRegNo';
Company.register();
