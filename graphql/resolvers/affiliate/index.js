const { MccAffiliateTC } = require('../../composers');

module.exports = () => {

  MccAffiliateTC.addResolver(require('./createAccount'))
  MccAffiliateTC.addResolver(require('./createCoupon'))

  // MccAffiliateTC.addResolver(require('./activateAccount'))
}
