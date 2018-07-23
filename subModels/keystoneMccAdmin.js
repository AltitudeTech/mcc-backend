const keystone = require('keystone');
var Types = keystone.Field.Types;
const jwt = require('jsonwebtoken');

const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * keystoneMccAdmin Model
 * ==========
 */
const keystoneMccAdmin = new keystone.List('keystoneMccAdmin', {
	track: true,
});

keystoneMccAdmin.add({
	name: { type: Types.Text, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	passwordVersion: { type: Types.Text, initial: false, required: true, default: 1},
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	recieveMccGuestEnquiries: { type: Boolean, label: 'receives notification email when an equiry is made', index: true },
	recieveMccAffiliateNotifications: { type: Boolean, label: 'receives notification email when an affiliate registers', index: true },
});

// Provide access to Keystone
keystoneMccAdmin.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

/**
 * Relationships
 */
// keystoneMccAdmin.relationship({ ref: 'Payment', path: 'payments', refPath: 'madeBy' });


/**
 * Registration
 */
keystoneMccAdmin.defaultColumns = 'name, email, isAdmin, recieveMccGuestEnquiries, recieveMccAffiliateNotifications';
keystoneMccAdmin.register();
