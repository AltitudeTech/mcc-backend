const { PaymentTC, TestCodeTC } = require('../../composers');

module.exports = () => {
  PaymentTC.addRelation('testCode', {
      resolver: () => TestCodeTC.getResolver('findOne'),
      prepareArgs: {
        filter: (source) => ({ assignedToPayment: source.paystackReference}),
      },
      projection: { assignedToPayment: true },
    }
  );
}
