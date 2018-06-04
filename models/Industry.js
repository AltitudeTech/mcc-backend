var keystone = require('keystone');

/**
 * Industry Model
 * ==================
 */

var Industry = new keystone.List('Industry', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Industry.add({
	name: { type: String, required: true },
});

Industry.relationship({ ref: 'Institution', path: 'Institutions', refPath: 'industry' });

Industry.register();
