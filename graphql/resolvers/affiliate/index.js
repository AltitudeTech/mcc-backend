const { MccAffiliateTC } = require('../../composers');

module.exports = () => {

  MccAffiliateTC.addResolver(require('./createAccount'))

  // MccAffiliateTC.addResolver(require('./activateAccount'))
}
