const keystone = require('keystone');
const NewsletterSubscriber = keystone.list('NewsletterSubscriber').model;
const { NewsletterSubscriberTC } = require('../../composers');

// activateAccount resolver for newsletterSubscriber
module.exports = {
  kind: 'mutation',
  name: 'subscribe',
  description: 'subscribe from newsletter',
  args: NewsletterSubscriberTC.getResolver('createOne').getArgs(),
  type: NewsletterSubscriberTC.getResolver('createOne').getType(),
  resolve: NewsletterSubscriberTC.getResolver('createOne').wrapResolve(next => async (rp) => {
    const { args } = rp
    try {
      const existing = await NewsletterSubscriber.findOne({email: args.record.email})
      if (existing) {
        if (!existing.isActive){
          existing.isActive = true;
          await existing.save();
          return existing;
        }
        throw new Error('this user is already subscribed')
      } else {
        const result = await next(rp);
        return result;
      }
    } catch (e) {
      throw (e)
    }
  }).getResolve(),
}
