var keystone = require('keystone');
var Types = keystone.Field.Types;

const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * Admin Model
 * ==========
 */
var Admin = new keystone.List('Admin', {
	track: true,
	inherits: keystone.list('User')
});

Admin.add('Admin',{
	phone: { type: Types.Text, initial: true, required: true, unique: true, sparse: true },
	username: { type: Types.Text, initial: true, unique: true, index: true, sparse: true },
	// category: {type: Types.Select, options: CANDIDATE_CATEGORIES}
}, 'Details', {
	address: { type: Types.Text },
	stateOfResidence: {type: Types.Select, options: STATES},
	imageUrl: { type: Types.Text},
	// bvn: { type: Types.Text},
	gender: {type: Types.Select, options: GENDERS},
	// dateOfBirth: { type: Types.Date },
	// placeOfBirth: { type: Types.Text},
	nationality: { type: Types.Text},
	// stateOfOrigin: { type: Types.Text},
}, 'Status', {
	isEmployed: { type: Boolean, index: true },
	isVerified: { type: Boolean, index: true },
}, 'verification', {
	// documentsUploaded: { type: Types.Relationship, ref: 'AdminDocument', many: true },
	//documents: { type: Types.Relationship, ref: 'AdminDocument', many: true },
}, 'Case File', {
	caseFile: { type: Types.Text, initial: false, required: true, default: 1},
});

// Model Hooks
Admin.schema.pre('save', function (next) {
	next();
});

/**
 * Relationships
 */
//Admin.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
Admin.defaultColumns = 'name, phone, email';
Admin.register();
