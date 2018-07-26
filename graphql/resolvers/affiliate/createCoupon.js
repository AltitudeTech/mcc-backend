const keystone = require('keystone');
const { MccCouponTC } = require('../../composers');
const jwt = require('jsonwebtoken');
const MccCoupon = keystone.list('MccCoupon').model;
const { InputTypeComposer } = require('graphql-compose')

InputTypeComposer.create({
  name: 'createAffiliateCouponInput',
  type: 'input',
  fields: {
    coupon: 'String!',
  }
});

module.exports = {
  kind: 'mutation',
  name: 'createCoupon',
  description: 'create an mcc coupon',
  args: { input: 'createAffiliateCouponInput!' },
  type: MccCouponTC,
  resolve: async ({ args: {input}, context, sourceUser }) => {
    const { coupon } = input;
    return MccCoupon.findOne({coupon}).then((existing) => {
      if (!existing) {
        // hash password and create user
        const newMccCoupon = new MccCoupon({
          coupon,
          discount: 10,
          affiliate: sourceUser._id
        })
        return newMccCoupon.save().then((coupon)=>{
          // const { id, coupon } = coupon;
          return coupon;
        }).catch((err) => {
          // console.log(err);
          return Promise.reject(err);
        })
      }
      return Promise.reject('coupon already exists');
    })
  }
};
