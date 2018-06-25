const { CandidateTC, PaymentTC } = require('../../composers');

module.exports = () => {
  CandidateTC.addRelation('payments', {
      resolver: () => PaymentTC.getResolver('findMany'),
      prepareArgs: {
        filter: (source) => ({ madeBy: source._id}),
      },
      projection: { madeBy: 1 },
    }
  );
}
