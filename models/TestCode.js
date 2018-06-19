var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * TestCode Model
 * ==========
 */
var TestCode = new keystone.List('TestCode', {
  map: { name: 'code' }
});

TestCode.add({
  code: { type: Types.Text, required: true, index: true, initial: true },
  isExpired: { type: Boolean, required: true, index: true, default: false },
  issueDate: { type: Types.Datetime, required: true, index: true, default: Date.now() },
  assignedTO: { type: Types.Relationship, ref: 'User', many: false, required: true, initial: true },
});


/**
 * Registration
 */
TestCode.defaultSort = 'code';
TestCode.defaultColumns = 'code, assignedTO, issueDate, isExpired';
TestCode.register();
