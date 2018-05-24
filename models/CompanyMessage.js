var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * CompanyMessage Model
 * =============
 */

var CompanyMessage = new keystone.List('CompanyMessage', {
	nocreate: true,
	// noedit: true,*/
	// track: true
});

CompanyMessage.add({
  company: { type: Types.Relationship, ref: 'Company', many: false },
	title: { type: Types.Text, initial: true, required: true},
	message: { type: Types.Textarea, initial: true, required: true },
  isClosed: { type: Boolean, default: false }
});
/*
CompanyMessage.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

CompanyMessage.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

CompanyMessage.schema.methods.sendNotificationEmail = function (callback) {
	if (typeof callback !== 'function') {
		callback = function (err) {
			if (err) {
				console.error('There was an error sending the notification email:', err);
			}
		};
	}

	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
		console.log('Unable to send email - no mailgun credentials provided');
		return callback(new Error('could not find mailgun credentials'));
	}

	var CompanyMessage = this;
	var brand = keystone.get('brand');

	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'CompanyMessage-notification',
			transport: 'mailgun',
		}).send({
			to: admins,
			from: {
				name: 'mycareerchoice-backend',
				email: 'contact@mycareerchoice-backend.com',
			},
			subject: 'New CompanyMessage for mycareerchoice-backend',
			CompanyMessage: CompanyMessage,
			brand: brand,
		}, callback);
	});
};*/

CompanyMessage.defaultSort = '-createdAt';
CompanyMessage.defaultColumns = 'company, title, isClosed';
CompanyMessage.register();
