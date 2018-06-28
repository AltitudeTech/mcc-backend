var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Newsletter Model
 * =============
 */

var Newsletter = new keystone.List('Newsletter', {
	map: {name: 'title'},
});

Newsletter.add({
	title: { type: Types.Text, required: true, initial: true },
	preHeader: { type: Types.Text, required: true, initial: true },
	subject: { type: Types.Text, default: 'MCC Newsletter', required: true, initial: true },
	content: { type: Types.Html, wysiwyg: true, height: 250, initial: true },
	state: { type: Types.Select, options: 'draft, published', default: 'draft', index: true, dependsOn: { isSent: false } },
	createdAt: { type: Date, default: Date.now, noedit: true },
	sentAt: { type: Date, noedit: true },
	isSent: { type: Boolean, noedit: true },
	// sentTo: { type: Types.Relationship, ref: 'NewsletterSubscriber', many: true },
});

// Newsletter.schema.pre('save', function (next) {
// 	// this.wasNew = this.isNew;
// 	next();
// });

Newsletter.schema.post('save', async function () {
	if (this.state == 'published' && !this.isSent) {
		// console.log('sending newsletter');
		try {
			await this.sendNewsletter();
			this.isSent = true;
			this.save();
		} catch (e) {
			console.log(e);
		}
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

		const brandDetails = keystone.get('brandDetails');

		new keystone.Email({
			templateName: 'newsletter',
			transport: 'mailgun',
		}).send({
			to: 'subscriber@mycareerchoice.global',
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
			// newsletter.sentTo = newsletterSubscribers.map(subscriber=>subscriber._id);
			// newsletter.save();
		});
		resolve();
	})
};

Newsletter.defaultSort = '-createdAt';
Newsletter.defaultColumns = 'title, subject, state, createdAt';
Newsletter.register();
