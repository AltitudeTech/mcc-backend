var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * SeekerResult Model
 * ==========
 */
var SeekerResult = new keystone.List('SeekerResult');

SeekerResult.add({
	fileTitle : { type: Types.Text},
	fileURL : { type: Types.Text},
	uploadedBy : { type: Types.Text},
	createdAt : { type: Types.Date, index: true, default: Date.now },
	updatedAt : { type: Types.Date, index: true },
});

// Provide access to Keystone
/*SeekerResult.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});*/


/**
 * Relationships
 */
//SeekerResult.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
SeekerResult.defaultColumns = 'fileTitle, fileURL, createdAt';
SeekerResult.register();
