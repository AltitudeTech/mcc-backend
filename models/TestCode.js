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
  createdAt: { type: Types.Datetime, index: true, default: Date.now(), noedit: true },
  // paystackReference
  assignedToPayment: { type: Types.Text, index: true, noedit: true, unique: true, sparse: true },
});

// TestCode.relationship({ ref: 'Payment', path: 'payment', refPath: 'testCode' });

/**
 * Registration
 */
TestCode.defaultSort = '-createdAt';
TestCode.defaultColumns = 'code, assignedToPayment, createdAt, isExpired';
TestCode.register();
