var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * GuestEnquiry Model
 * =============
 */

var GuestEnquiry = new keystone.List('GuestEnquiry', {
	nocreate: true,
	noedit: true,
});

GuestEnquiry.add({
	name: { type: Types.Text, required: true },
	email: { type: Types.Email, required: true },
	message: { type: Types.Textarea, required: true },
	createdAt: { type: Date, default: Date.now },
});

GuestEnquiry.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

GuestEnquiry.schema.post('save', function () {
	if (this.wasNew) {
		try {
			this.sendNotificationEmail();
			this.sendConfirmationEmail();
		} catch (e) {
			console.log(e);
		}
	}
});

GuestEnquiry.schema.methods.sendNotificationEmail = function () {
	var enquiry = this;

	return new Promise(function(resolve, reject) {
		console.log("sending enquiry confirmation email");

		if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
			console.log('Unable to send email - no mailgun credentials provided');
			return callback(new Error('could not find mailgun credentials'));
		}

		var brand = keystone.get('brand');

		keystone.list('User').model.find({isAdmin: true, sendGuestEnquiries: true}).exec(function (err, admins) {
			if (err) return callback(err);
			new keystone.Email({
				templateName: 'guest-enquiry-notification',
				transport: 'mailgun',
			}).send({
				to: admins,
				from: {
					name: 'MCC',
					email: 'contact@mycareerchoice.global',
				},
				subject: 'New GuestEnquiry for MCC',
				enquiry: enquiry,
				brand: brand,
			}, (err)=>{
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve();
			});
		});
	})
};

// guest-enquiry-confirmation
GuestEnquiry.schema.methods.sendConfirmationEmail = function () {
	const enquiry = this;
	return new Promise(function(resolve, reject) {
		console.log("sending enquiry confirmation email");

		if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
			console.log('Unable to send email - no mailgun credentials provided');
			reject(new Error('could not find mailgun credentials'));
		}

		const brand = keystone.get('brand');

		new keystone.Email({
			templateName: 'guest-enquiry-confirmation',
			transport: 'mailgun',
		}).send({
			to: [enquiry.email],
			from: {
				name: 'MCC',
				email: 'no-reply@mycarrerchoice.global',
			},
			subject: 'MCC Enquiry',
			enquiry,
			brand,
		}, (err)=>{
			if (err) {
				console.log(err);
				reject(err);
			}
			resolve();
		});
	});
}

GuestEnquiry.defaultSort = '-createdAt';
GuestEnquiry.defaultColumns = 'name, email, enquiryType, createdAt';
GuestEnquiry.register();
