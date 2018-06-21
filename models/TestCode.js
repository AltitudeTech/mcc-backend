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
  code: { type: Types.Text, required: true, index: true, initial: true, unique: true },
  isExpired: { type: Boolean, index: true, default: false },
  isAssigned: { type: Boolean, index: true, default: false },
  issueDate: { type: Types.Datetime, index: true, default: Date.now(), required: true, },
  // assignedTO: { type: Types.Relationship, ref: 'User', many: false, initial: true, noedit: true },
});

TestCode.relationship({ ref: 'Payment', path: 'payment', refPath: 'testCode' });

/**
 * Registration
 */
TestCode.defaultSort = 'code';
TestCode.defaultColumns = 'code, assignedTO, issueDate, isExpired';
TestCode.register();
