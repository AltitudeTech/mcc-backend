var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Price Model
 * ==========
 */
var Price = new keystone.List('Price', {
    track: true,
    noedit: true
    // map: {name: ''}
});

Price.add({
  price: { type: Types.Text, required: true, index: true, initial: true },
  description: { type: Types.Text, index: true, initial: true },
});

/**
 * Registration
 */
Price.defaultSort = 'createdAt';
Price.defaultColumns = 'price, description, createdAt';
Price.register();
