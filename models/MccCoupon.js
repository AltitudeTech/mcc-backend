var keystone = require('keystone');
var Types = keystone.Field.Types;

const Joi = require('joi');
/**
 * MccCoupon Model
 * ==========
 */
var MccCoupon = new keystone.List('MccCoupon', {
    track: true,
    // noedit: true,
    map: {name: 'coupon'}
});

MccCoupon.add({
  coupon: { type: Types.Text, required: true, index: true, initial: true },
  affiliate: { type: Types.Relationship, ref: 'MccAffiliate', required: false, initial: true},
  description: { type: Types.Text, index: true, initial: true },
  discount: { type: Types.Number, label: 'discount(in %)', required: true, initial: true },
  isExpirable: { type: Types.Boolean, index: true, default: false},
  expiriesAt: { type: Types.Date, index: true, dependsOn: { isExpirable: true} }
});
const schema = Joi.object().keys({
    coupon: Joi.string().alphanum().min(6).max(10).required(),
    discount: Joi.number().integer().min(0).max(100),
})
MccCoupon.schema.pre('save',async function (next) {
  if (this.isModified("isExpirable")) {
		if (this.expiriesAt == null) this.expiriesAt = Date.now()
	}
  const {error, value} = Joi.validate({
    coupon: this.coupon,
    discount: this.discount
  }, schema);
  if (error) {
    // return next(error);
    switch (error.details[0].context.key) {
      case 'coupon':
        return next(new Error('your coupon must be between six(6) and ten(10) characters in length'));
      break;
      case 'discount':
        return next(new Error('discount must be an integer between 0 and 100'))
      break;
    }
  }
  next();
})
// MccCoupon.relationship({ ref: 'MccAffiliate', path: 'MCC Affiliates', refPath: 'coupon' });
MccCoupon.relationship({ ref: 'Payment', path: 'payments', refPath: 'coupon' });

/**
 * Registration
 */
MccCoupon.defaultSort = 'createdAt';
MccCoupon.defaultColumns = 'coupon, description, createdAt';
MccCoupon.register();
