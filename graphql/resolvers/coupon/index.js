const { MccCouponTC } = require('../../composers');

module.exports = () => {
  // Queries
  // MccCouponTC.addResolver(require('./isAuthenticated'));

  // Mutations
  MccCouponTC.addResolver(require('./findCoupon'));
}
