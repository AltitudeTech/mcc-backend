var keystone = require('keystone');
var Types = keystone.Field.Types;


const { STATES, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * Institution Model
 * ==========
 */
var Institution = new keystone.List('Institution', {
	track: true,
	inherits: keystone.list('User')
});

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

Institution.add('Institution',{
	name: { type: String, required: true, index: true },
	// cacRegNo: { type: Types.Text, initial: true, index: true, required: true, unique: true, sparse: true },
	phone: { type: Types.Text, initial: true, required: true, unique: true, sparse: true },
	isActivated: { type: Boolean, default: false },
	// logoUrl: { type: Types.Text, initial: true },
	website: { type: Types.Url, initial: true },
	address: { type: Types.Text, initial: true },
	stateOfResidence: {type: Types.Select, options: STATES, index: true},
	description: { type: Types.Text, initial: true },
	yearFounded: { type: Types.Number, initial: true, index: true },
	staffSize: {type: Types.Select, options: staffOptions},
	industry: { type: Types.Relationship, ref: 'Industry', many: false, initial: true },
	industries: { type: Types.Relationship, ref: 'Industry', many: true, initial: true },
});

// Provide access to Keystone
/*Institution.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});*/


/**
 * Relationships
 */
//Institution.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

Institution.schema.pre('save', function (next) {
  this.name = toCamelCase(this.name);
	next();
});

/**
 * Registration
 */
Institution.defaultSort = '-createdAt';
Institution.defaultColumns = 'name, phone, email, cacRegNo';
Institution.register();
