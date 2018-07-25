const keystone = require('keystone');
const MccCoupon = keystone.list('MccCoupon').model;
const { MccCouponTC } = require('../../composers');
const moment = require('moment');

if (!process.env.PAYSTACK_SECRET_KEY){
  console.error('PAYSTACK_SECRET_KEY is missing from env');
}
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

// loginWithEmail resolver for user
module.exports = {
  kind: 'mutation',
  name: 'findCoupon',
  description: 'searches the datatbase for a coupon',
  args: { coupon: 'String!' },
  type: MccCouponTC,
  resolve: async ({ args, context }) => {
    const { coupon } = args;
    try {
      const existingCoupon = await MccCoupon.findOne({ coupon });
      if (existingCoupon) {
        if (existingCoupon.isExpirable) {
          if (moment(existingCoupon.expiriesAt).isBefore(Date.now())){
            return Promise.reject('expired coupon');
          }
        }
        return (existingCoupon)
      } else {
        return Promise.reject('coupon not found');
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
}
