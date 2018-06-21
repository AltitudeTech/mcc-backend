var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Payment Model
 * ==========
 */
var Payment = new keystone.List('Payment', {
    //track: true
});

Payment.add({
  // name: { type: Types.Text, required: true, index: true },
  createdAt: { type: Types.Datetime, index: true, default: Date.now() },
  paystackReference: { type: Types.Text, required: true, index: true, initial: true, unique: true },
  madeBy: { type: Types.Relationship, ref: 'User', many: false, required: true, initial: true },
  testCode: { type: Types.Relationship, ref: 'TestCode', many: false, unique: true, sparse: true, initial: true },
});

// Model Hooks
Payment.schema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

Payment.schema.post('save', function () {
  if (this.wasNew) {
    keystone.list('TestCode').model.findOneAndUpdate({_id: this.testCode}, {isAssigned: true});
	}
});

/**
 * Registration
 */
Payment.defaultSort = 'createdAt';
Payment.defaultColumns = 'createdAt, paystackReference, madeBy';
Payment.register();
