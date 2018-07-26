const { MccAffiliateTC, CandidateTC, MccCouponTC, PaymentTC } = require('../../composers');
const keystone = require('keystone');

module.exports = () => {
  MccAffiliateTC.addRelation('customers', {
      resolver: () => CandidateTC.getResolver('pagination'),
      prepareArgs: {
        filter: (source) => ({ coupon: source.coupon}),
      },
      projection: { coupon: 1 },
    }
  );
  MccAffiliateTC.addRelation('customerPayments', {
    resolver: () => PaymentTC.getResolver('pagination').wrapResolve(next => async (rp) => {
      const user = await rp.context.MccAffiliate;
      const coupon = await keystone.list('MccCoupon').model.findOne({affiliate: user._id})

      rp.args.filter = { coupon: coupon._id }

      return next(rp);
    })}
  );
  MccAffiliateTC.addRelation('coupon', {
    resolver: () => MccCouponTC.getResolver('findOne'),
    prepareArgs: {
      filter: (source) => ({ affiliate: source._id}),
    },
    projection: { affiliate: 1 },
  });
}
