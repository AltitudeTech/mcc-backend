const keystone = require('keystone');
const { NewsletterSubscriberTC } = require('../../composers');
const mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

// activateAccount resolver for newsletterSubscriber
module.exports = {
  kind: 'mutation',
  name: 'subscribe',
  description: 'subscribe from newsletter',
  args: { address: 'String!'},
  type: NewsletterSubscriberTC,
  resolve: async ({ args }) => {
    const { address } = args;
    const user = {
      subscribed: true,
      address,
      // name: 'Bob Bar',
      // vars: {age: 26}
    };

    const list = mailgun.lists('subscribers@mycareerchoice.global');
    return new Promise(function(resolve, reject) {
      list.members().create(user, function (err, data) {
        if (err) {
          delete user.address
          list.members(address).update({subscribed: 'true'}, function (err, updateData) {
            if (err) {
              reject(err)
            }
            resolve(updateData.member)
          });
        } else {
          // `data` is the member details
          resolve(data.member)
        }
      });

    });
  }
  // resolve: NewsletterSubscriberTC.getResolver('createOne').wrapResolve(next => async (rp) => {
  //   const { args } = rp
  //   try {
  //     // const existing = await NewsletterSubscriber.findOne({email: args.record.email})
  //     const existing = {}
  //     if (existing) {
  //       if (!existing.isActive){
  //         existing.isActive = true;
  //         await existing.save();
  //         return existing;
  //       }
  //       throw new Error('this user is already subscribed')
  //     } else {
  //       const result = await next(rp);
  //       return result;
  //     }
  //   } catch (e) {
  //     throw (e)
  //   }
  // }).getResolve(),
}
