var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Newsletter Model
 * =============
 */

var Newsletter = new keystone.List('Newsletter', {
	map: {name: 'title'},
	noedit: true,
});

Newsletter.add({
	title: { type: Types.Text, required: true, initial: true },
	preHeader: { type: Types.Text, required: true, initial: true },
	subject: { type: Types.Text, default: 'MCC Newsletter', required: true, initial: true },
	content: { type: Types.Html, wysiwyg: true, height: 250, initial: true },
	state: { type: Types.Select, options: 'draft, published', default: 'draft', index: true },
	createdAt: { type: Date, default: Date.now },
	sentTo: { type: Types.Relationship, ref: 'NewsletterSubscriber', many: true },
});

Newsletter.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Newsletter.schema.post('save', function () {
	if (this.state == 'published') {
		console.log('sending newsletter');
		// this.sendNewsletter();
	}
});

Newsletter.schema.methods.sendNewsletter = function () {
	var newsletter = this;

	return new Promise(function(resolve, reject) {
		console.log("sending newsletter email");

		if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
			console.log('Unable to send email - no mailgun credentials provided');
			return callback(new Error('could not find mailgun credentials'));
		}

		var brandDetails = keystone.get('brandDetails');

		keystone.list('NewsletterSubscriber').model.find({isActive: true}).exec(function (err, newsletterSubscribers) {
			if (err) reject(err);
			new keystone.Email({
				templateName: 'newsletter',
				transport: 'mailgun',
			}).send({
				to: newsletterSubscribers.map(subscriber=>subscriber.email),
				from: {
					name: 'MCC',
					email: 'contact@mycareerchoice.global',
				},
				subject: newsletter.subject,
				newsletter,
				brandDetails,
			}, (err)=>{
				if (err) {
					console.log(err);
					reject(err);
				}
				newsletter.sentTo = newsletterSubscribers.map(subscriber=>subscriber._id);
				newsletter.save();
			});
			resolve();
		});
	})
};

Newsletter.defaultSort = '-createdAt';
Newsletter.defaultColumns = 'name, email, enquiryType, createdAt';
Newsletter.register();
