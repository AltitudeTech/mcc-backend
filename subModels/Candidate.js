const keystone = require('keystone');
var Types = keystone.Field.Types;
const jwt = require('jsonwebtoken');

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
Candidate.schema.post('save',async function () {
	if (this.wasNew) {
		try {
			this.sendActivationLink();
		} catch (e) {
			console.log(e);
		}
	}
});

// Methods
Candidate.schema.methods.sendActivationLink = function () {
	const user = this;
	return new Promise(function(resolve, reject) {
		console.log("sending user activation email");
		if (user.isActivated) {
			// console.log('Account is already activated');
			reject(new Error('Account is already activated'));
		}

		if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
			console.log('Unable to send email - no mailgun credentials provided');
			reject(new Error('could not find mailgun credentials'));
		}

		const brand = keystone.get('brand');

		const code = jwt.sign({
			id: user._id,
			createdAt: Date.now(),
		}, process.env.ACTIVATION_JWT_SECRET);
		const activationLink = `http://mycareerchoice.global/activate?code=${code}`

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
		}, (err)=>{
			if (err) {
				console.log(err);
			}
		});
	});
}

/**
 * Relationships
 */
Candidate.relationship({ ref: 'Payment', path: 'payments', refPath: 'madeBy' });


/**
 * Registration
 */
Candidate.defaultColumns = 'name, phone, email';
Candidate.register();
