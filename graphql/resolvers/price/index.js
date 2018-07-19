const { PriceTC } = require('../../composers');

module.exports = () => {
  // Queries
  PriceTC.addResolver(require('./latestPrice'));
}
