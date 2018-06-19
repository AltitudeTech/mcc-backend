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
  paystackReference: { type: Types.Text, required: true, index: true, initial: true },
  madeBy: { type: Types.Relationship, ref: 'User', many: false, required: true, initial: true },
});


/**
 * Registration
 */
Payment.defaultSort = 'createdAt';
Payment.defaultColumns = 'createdAt, paystackReference, madeBy';
Payment.register();
