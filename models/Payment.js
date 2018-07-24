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
  createdAt: { type: Types.Datetime, index: true, default: Date.now(), noedit: true },
  paystackReference: { type: Types.Text, required: true, index: true, initial: true, unique: true },
  madeBy: { type: Types.Relationship, ref: 'User', many: false, required: true, initial: true },
  coupon: { type: Types.Relationship, ref: 'MccCoupon', initial: true},
  amount: { type: Types.Number, required: true, initial: true }
  // testCode: { type: Types.Relationship, ref: 'TestCode', required: true, initial: true, index: true },
});

// Model Hooks
Payment.schema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

Payment.schema.post('save', function () {
  if (this.wasNew) {
    // keystone.list('TestCode').model.findByIdAndUpdate(this.testCode, {isAssigned: true}).exec();
	}
});

/**
 * Registration
 */
Payment.defaultSort = '-createdAt';
Payment.defaultColumns = 'createdAt, paystackReference, madeBy';
Payment.register();
