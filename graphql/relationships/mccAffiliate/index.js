const { MccAffiliateTC, CandidateTC, MccCouponTC } = require('../../composers');

module.exports = () => {
  MccAffiliateTC.addRelation('customers', {
      resolver: () => CandidateTC.getResolver('pagination'),
      prepareArgs: {
        filter: (source) => ({ coupon: source.coupon}),
      },
      projection: { coupon: 1 },
    }
  );
  MccAffiliateTC.addRelation('coupon', {
      resolver: () => MccCouponTC.getResolver('findById'),
      prepareArgs: {
        _id: (source) => source.coupon,
      },
      projection: { coupon: 1 },
    }
  );
}
