var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * MccCoupon Model
 * ==========
 */
var MccCoupon = new keystone.List('MccCoupon', {
    track: true,
    noedit: true,
    map: {name: 'coupon'}
});

MccCoupon.add({
  coupon: { type: Types.Text, required: true, index: true, initial: true },
  affiliate: { type: Types.Relationship, ref: 'MccAffiliate', required: false, initial: true},
  description: { type: Types.Text, index: true, initial: true },
  discount: { type: Types.Number, label: 'discount(in %)', required: true, initial: true },
  expiriesAt: { type: Types.Date, index: true },
  isActive: { type: Types.Boolean, index: true, default: true}
});

// MccCoupon.relationship({ ref: 'MccAffiliate', path: 'MCC Affiliates', refPath: 'coupon' });
MccCoupon.relationship({ ref: 'Payment', path: 'payments', refPath: 'coupon' });

/**
 * Registration
 */
MccCoupon.defaultSort = 'createdAt';
MccCoupon.defaultColumns = 'coupon, description, createdAt';
MccCoupon.register();
