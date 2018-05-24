var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * SkillAnalysisResult Model
 * ==========
 */
var SkillAnalysisResult = new keystone.List('SkillAnalysisResult');

SkillAnalysisResult.add({
	fileTitle : { type: Types.Text},
	fileURL : { type: Types.Text},
	uploadedBy : { type: Types.Text},
	createdAt : { type: Types.Date, index: true, default: Date.now },
	updatedAt : { type: Types.Date, index: true },
});

// Provide access to Keystone
/*SkillAnalysisResult.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});*/


/**
 * Relationships
 */
//SkillAnalysisResult.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
SkillAnalysisResult.defaultColumns = 'fileTitle, fileURL, createdAt';
SkillAnalysisResult.register();
