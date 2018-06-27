const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const NewsletterSubscriber = keystone.list('NewsletterSubscriber').model;
const { NewsletterSubscriberTC } = require('../../composers');

// activateAccount resolver for newsletterSubscriber
module.exports = {
  kind: 'mutation',
  name: 'unsubscribe',
  description: 'unsubscribe subscriber from newsletter',
  args: {code: 'String!'},
  type: NewsletterSubscriberTC,
  resolve: async ({ args, context }) => {
    const { code } = args;
    try {
      const data = jwt.verify(code, process.env.NEWSLETTER_JWT_SECRET);
      const { id } = data;
      if (id) {
          const newsletterSubscriber = await NewsletterSubscriber.findOne({_id: id});
          if (!newsletterSubscriber.isActive) {
            return Promise.reject('this email is not subscribed')
          } else {
            newsletterSubscriber.isActive = false;
            await newsletterSubscriber.save();
            return { email: newsletterSubscriber.email };
          }
      } else {
        return Promise.reject('invalid token')
      }
    } catch (e) {
      throw e;
    }
  },
}
