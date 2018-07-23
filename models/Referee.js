var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Referee Model
 * ==========
 */
var Referee = new keystone.List('Referee');

const { GENDERS, PHONE_REGEX, toCamelCase  } = require('../lib/common');

Referee.add({
	name: { type: Types.Name, required: true, index: true },
	phone: { type: Types.Text, initial: true, required: true},
	// gender: {type: Types.Select, options: ['male','female'], initial: true},
	// gender: {type: Types.Select, options: GENDERS, initial: true},
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	// password: { type: Types.Password, initial: true, required: true },
	// passwordVersion: { type: Types.Text, initial: false, required: true, default: 1},
	// occupation: { type: Types.Text, initial: true},
	// relationship: { type: Types.Text, initial: true},
	// letter: { type: Types.Textarea, initial: true},
}, 'verification', {
	isVerified: { type: Boolean, index: true },
});

// Model Hooks
Referee.schema.pre('save', function (next) {
  this.name.first = toCamelCase(this.name.first);
  this.name.last = toCamelCase(this.name.last);
  if (PHONE_REGEX.test(this.phone)){
    next();
  } else {
		next(new Error('Invalid Phone Number'));
	}
});

/**
 * Relationships
 */
//Referee.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
Referee.defaultColumns = 'name, phone, email, isVerified';
Referee.register();
