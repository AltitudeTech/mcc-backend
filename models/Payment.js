var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Payment Model
 * ==========
 */
<<<<<<< HEAD
var Payment = new keystone.List('Payment', {
    //track: true
});

Payment.add({
  // name: { type: Types.Text, required: true, index: true },
  createdAt: { type: Types.Datetime, index: true, default: Date.now() },
  paystackReference: { type: Types.Text, required: true, index: true, initial: true },
  madeBy: { type: Types.Relationship, ref: 'User', many: false, required: true, initial: true },
});


/**
 * Registration
 */
Payment.defaultSort = 'createdAt';
Payment.defaultColumns = 'createdAt, paystackReference, madeBy';
=======

var Payment = new keystone.List('Payment', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Payment.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	//image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	//categories: { type: Types.Relationship, ref: 'PaymentCategory', many: true },
});

Payment.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Payment.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%, slug';
>>>>>>> e1aa34794c90814edbb84b3d785bb71e72944f29
Payment.register();
