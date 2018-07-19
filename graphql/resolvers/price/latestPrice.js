const { PriceTC } = require('../../composers');
const keystone = require('keystone');
const Price = keystone.list('Price').model;

module.exports = {
  kind: 'query',
  name: 'latestPrice',
  description: 'returns the most recent price in the database',
  type: PriceTC,
  resolve: () => Price.findOne().sort({createdAt: -1})
}
