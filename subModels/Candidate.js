const keystone = require('keystone');
var Types = keystone.Field.Types;

const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * Candidate Model
 * ==========
 */
const Candidate = new keystone.List('Candidate', {
	track: true,
	inherits: keystone.list('User')
});

Candidate.add('Candidate', {
	phone: { type: Types.Text, initial: true, required: true, unique: true, sparse: true },
	isActivated: { type: Boolean, default: false }
});

//Model Hooks
Candidate.schema.post('save', function () {
	if (this.wasNew) {
		this.sendActivationLink();
	}
});

// Methods
Candidate.schema.methods.sendActivationLink = function (callback) {

	if (this.isActivated) {
		console.log('Account is already activated');
		return callback(new Error('Account is already activated'));
	}

	if (typeof callback !== 'function') {
		callback = function (err) {
			if (err) {
				console.error('There was an error sending the activation link email:', err);
			}
		};
	}

	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
		console.log('Unable to send email - no mailgun credentials provided');
		return callback(new Error('could not find mailgun credentials'));
	}

	const user = this;
	const brand = keystone.get('brand');

	const code = jwt.sign({
		id: this._id,
		createdAt: Date.now(),
	}, process.env.ACTIVATION_JWT_SECRET);
	const activationLink = `http://localhost:3000/activate?code=${code}`

  new keystone.Email({
    templateName: 'activate-account',
    transport: 'mailgun',
  }).send({
    to: [user.email],
    from: {
      name: 'MCC',
      email: 'no-reply@mycarrerchoice.global',
    },
    subject: 'MCC Account Activation',
    user,
    brand,
		activationLink
  }, callback);
};

/**
 * Relationships
 */
//Candidate.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
Candidate.defaultColumns = 'name, phone, email';
Candidate.register();
