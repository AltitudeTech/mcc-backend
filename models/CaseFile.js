var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * CaseFile Model
 * ==========
 */

var CaseFile = new keystone.List('CaseFile', {
	map: { name: 'title' },
	// autokey: { path: 'slug', from: 'title', unique: true },
});

CaseFile.add({
	title: { type: String, required: true },
	fileNumber: { type: Types.Number, default: 1, required: true, index: true },
	authorManager: { type: Types.Relationship, ref: 'CenterManager', index: true },
	candidate: { type: Types.Relationship, ref: 'Candidate', index: true },
	owner: { type: Types.Relationship, ref: 'Candidate', index: true },
	createdAt: { type: Types.Datetime, index: true, default: Date.now() },
	content: { type: Types.Html, wysiwyg: true, height: 200 },
	// content: { type: Types.Markdown , height: 400 },
	// state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	// author: { type: Types.Relationship, ref: 'User', index: true },
	// authorManager: { type: Types.Relationship, ref: 'User', index: true },
});

CaseFile.defaultColumns = 'title, candidate|20%, createdAt|20%';
CaseFile.register();
