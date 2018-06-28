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
	createdAt: { type: Date, default: Date.now, noedit: true },
	// sentTo: { type: Types.Relationship, ref: 'NewsletterSubscriber', many: true },
}, 'To send out this newsletter set the <state> below to published, save and refresh the page',{
	state: { type: Types.Select, options: 'draft, published', default: 'draft', index: true, dependsOn: { isSent: false } },
	isSent: { type: Boolean, noedit: true },
	sentAt: { type: Date, noedit: true },
}, 'if the <state> field is missing it means this newsletter has already been sent and will not be resent');

Newsletter.schema.pre('save', async function (next) {
	if (this.state == 'published' && !this.isSent) {
		// console.log('sending newsletter');
		try {
			await this.sendNewsletter();
			this.sentAt = Date.now();
			this.isSent = true;
			next();
		} catch (e) {
			console.log(e);
			next(e);
		}
	}
});

// Newsletter.schema.post('save', async function () {
// 	if (this.state == 'published' && !this.isSent) {
// 		// console.log('sending newsletter');
// 		try {
// 			await this.sendNewsletter();
// 			this.isSent = true;
// 			this.sentAt = Date.now;
// 			this.save();
// 		} catch (e) {
// 			console.log(e);
// 		}
// 	}
// });

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
			to: 'subscribers@mycareerchoice.global',
			from: {
				name: 'MCC',
				email: 'contact@mycareerchoice.global',
			},
			subject: newsletter.subject,
			newsletter,
			brandDetails,
		}, (err)=>{
			if (err) {
				reject(err);
			}
		});
		resolve();
	})
};

Newsletter.defaultSort = '-createdAt';
Newsletter.defaultColumns = 'title, subject, state, createdAt';
Newsletter.register();
