const keystone = require('keystone');
var Types = keystone.Field.Types;
const jwt = require('jsonwebtoken');

const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * keystoneAdmin Model
 * ==========
 */
const keystoneAdmin = new keystone.List('keystoneAdmin', {
	track: true,
	inherits: keystone.list('User')
});

keystoneAdmin.add('Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	recieveGuestEnquiries: { type: Boolean, label: 'receives notification email when an equiry is made', index: true },
});

// Provide access to Keystone
keystoneAdmin.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

/**
 * Relationships
 */
// keystoneAdmin.relationship({ ref: 'Payment', path: 'payments', refPath: 'madeBy' });


/**
 * Registration
 */
keystoneAdmin.defaultColumns = 'name, email, canAccessKeystone, isAdmin';
keystoneAdmin.register();
