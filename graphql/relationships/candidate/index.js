const { CandidateTC, PaymentTC, NotificationTC } = require('../../composers');

module.exports = () => {
  CandidateTC.addRelation('payments', {
      resolver: () => PaymentTC.getResolver('findMany'),
      prepareArgs: {
        filter: (source) => ({ madeBy: source._id}),
      },
      projection: { madeBy: 1 },
    }
  );
  CandidateTC.addRelation('notifications', {
    resolver: () => NotificationTC.getResolver('userNotifications'),
    prepareArgs: {
      filter: (source) => ({ userId: source._id, userCreatedAt: source.createdAt}),
    },
    projection: { _id: true, createdAt: true },
  });
}
