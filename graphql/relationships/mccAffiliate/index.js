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
      resolver: () => MccCouponTC.getResolver('findOne'),
      prepareArgs: {
        filter: (source) => ({ affiliate: source._id}),
      },
      projection: { affiliate: 1 },
    }
  );
}
