var keystone = require('keystone');
var Types = keystone.Field.Types;
const jwt = require('jsonwebtoken');

/**
 * NewsletterSubscriber Model
 * =============
 */

var NewsletterSubscriber = new keystone.List('NewsletterSubscriber', {
	map: { name: 'email' },
	nocreate: true,
	noedit: true,
});

NewsletterSubscriber.add({
	email: { type: Types.Email, required: true, unique: true, index: true },
	createdAt: { type: Date, default: Date.now, index: true },
	isActive: {type: Boolean, default: true, index: true},
	unsubcribeCode: { type: Types.Text }
});

NewsletterSubscriber.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	if (this.isNew) {
		this.unsubcribeCode = jwt.sign({
			id: this._id,
		}, process.env.NEWSLETTER_JWT_SECRET);
	}
	next();
});

NewsletterSubscriber.schema.post('save', function () {
	if (this.wasNew) {
		try {
			this.sendConfirmationEmail();
		} catch (e) {
			console.log(e);
		}
	}
});

// guest-enquiry-confirmation
NewsletterSubscriber.schema.methods.sendConfirmationEmail = function () {
	const newsletterSubscriber = this;
	return new Promise(function(resolve, reject) {
		console.log("sending Newsletter subscription confirmation email");

		if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
			console.log('Unable to send email - no mailgun credentials provided');
			reject(new Error('could not find mailgun credentials'));
		}

		const brandDetails = keystone.get('brandDetails');
		const unsubcribeLink = `${process.env.FRONT_END_URL}/unsubcribe?code=${newsletterSubscriber.unsubcribeCode}`;

		new keystone.Email({
			templateName: 'newsletter-subscription-confirmation',
			transport: 'mailgun',
		}).send({
			to: [newsletterSubscriber.email],
			from: {
				name: 'MCC',
				email: 'no-reply@mycarrerchoice.global',
			},
			subject: 'MCC Newsletter subscription',
			unsubcribeLink,
			newsletterSubscriber,
			brandDetails,
		}, (err)=>{
			if (err) {
				console.log(err);
				reject(err);
			}
			resolve();
		});
	});
}

NewsletterSubscriber.defaultSort = '-createdAt';
NewsletterSubscriber.defaultColumns = 'email, isActive, createdAt';
NewsletterSubscriber.register();
