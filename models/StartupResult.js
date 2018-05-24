var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * StartupResult Model
 * ==========
 */
var StartupResult = new keystone.List('StartupResult');

StartupResult.add({
	fileTitle : { type: Types.Text},
	fileURL : { type: Types.Text},
	uploadedBy : { type: Types.Text},
	createdAt : { type: Types.Date, index: true, default: Date.now },
	updatedAt : { type: Types.Date, index: true },
});

// Provide access to Keystone
/*StartupResult.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});*/


/**
 * Relationships
 */
//StartupResult.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
StartupResult.defaultColumns = 'fileTitle, fileURL, createdAt';
StartupResult.register();
