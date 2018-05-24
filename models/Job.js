var keystone = require('keystone');
var Types = keystone.Field.Types;

const { STATES, MONTHS, toCamelCase  } = require('../lib/common');

/**
 * Job Model
 * ==========
 */
var Job = new keystone.List('Job', {
	track: true
});

typeOptions = [
	{ value: 'fullTime', label: 'Full-time' },
	{ value: 'partTime', label: 'Part-time' },
	{ value: 'contract', label: 'Contract' },
	{ value: 'temporary', label: 'Temporary' },
	{ value: 'volunteer', label: 'Volunteer' },
	{ value: 'internship', label: 'Internship' },
]

Job.add({
	role: { type: String, required: true, index: true, initial: true },
	// address: { type: Types.Text, initial: true, required: true},
	state: {type: Types.Select, options: STATES},
	basicDescription: { type: Types.Textarea, initial: true },
	fullDescription: { type: Types.Textarea, initial: true },
	vacancy: { type: Types.Text, initial: true },
	employmentType: {type: Types.Select, options: typeOptions},
	// industry: { type: Types.Relationship, ref: 'Industry', many: false },
	industries: { type: Types.Relationship, ref: 'Industry', many: true },
	salary: { type: Types.Text, initial: true, required: false},
	publishedDate: { type: Date, index: true, initial: true, default: Date.now },
	expiryDate: { type: Date, index: true, initial: true },
}, 'Contact', {
	contactEmail: { type: Types.Text, initial: true },
	contactPhone: { type: Types.Text, initial: true },
	contactName: { type: Types.Text, initial: true },
}, 'Status', {
	isVacant: {type: Boolean, default: false, index: true},
	isOnDisplay: {type: Boolean, default: false, index: true},
}, 'Requirements', {
	// address: { type: Types.Text, initial: true },
});

// Provide access to Keystone
/*Job.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});*/


/**
 * Relationships
 */
//Job.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
Job.defaultColumns = 'title, role, industry';
Job.register();
