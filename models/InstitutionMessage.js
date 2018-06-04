var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * InstitutionMessage Model
 * =============
 */

var InstitutionMessage = new keystone.List('InstitutionMessage', {
	nocreate: true,
	// noedit: true,*/
	// track: true
});

InstitutionMessage.add({
  institution: { type: Types.Relationship, ref: 'Institution', many: false },
	title: { type: Types.Text, initial: true, required: true},
	message: { type: Types.Textarea, initial: true, required: true },
  isClosed: { type: Boolean, default: false }
});
/*
InstitutionMessage.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

InstitutionMessage.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

InstitutionMessage.schema.methods.sendNotificationEmail = function (callback) {
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

	var InstitutionMessage = this;
	var brand = keystone.get('brand');

	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'InstitutionMessage-notification',
			transport: 'mailgun',
		}).send({
			to: admins,
			from: {
				name: 'mycareerchoice-backend',
				email: 'contact@mycareerchoice-backend.com',
			},
			subject: 'New InstitutionMessage for mycareerchoice-backend',
			InstitutionMessage: InstitutionMessage,
			brand: brand,
		}, callback);
	});
};*/

InstitutionMessage.defaultSort = '-createdAt';
InstitutionMessage.defaultColumns = 'institution, title, isClosed';
InstitutionMessage.register();
