const { PaymentTC } = require('../../composers');

module.exports = () => {
  // Queries
  // PaymentTC.addResolver(require('./isAuthenticated'));

  // Mutations
  PaymentTC.addResolver(require('./findOrCreatePayment'));
}
