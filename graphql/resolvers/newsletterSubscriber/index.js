const { NewsletterSubscriberTC } = require('../../composers');

module.exports = () => {
  // Mutations
  // NewsletterSubscriberTC.addResolver(require('./unsubscribe'));
  NewsletterSubscriberTC.addResolver(require('./subscribe'));
}
