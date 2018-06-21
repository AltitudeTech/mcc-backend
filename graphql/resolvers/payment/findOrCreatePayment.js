const keystone = require('keystone');
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const Payment = keystone.list('Payment').model;
const TestCode = keystone.list('TestCode').model;
const { PaymentTC } = require('../../composers');

// loginWithEmail resolver for user
module.exports = {
  kind: 'mutation',
  name: 'findOrCreatePayment',
  description: 'find or verfies a payment and assign a test code',
  args: { paystackReference: 'String!' },
  type: PaymentTC,
  resolve: async ({ args, context, sourceUser }) => {
    const { paystackReference } = args;
    try {
      const existing = await Payment.findOne({paystackReference});
      if (existing) {
        return (existing)
      } else {
        //find code and add to payment
        return new Promise((resolve, reject) => {
          paystack.transactions.verify(paystackReference, async (error, body) => {
            if (error) {
              reject(error)
            }
            // console.log(body);
            if (body.status){
              if (body.data.status=="success") {
                //find code and add to payment
                const testCode = await TestCode.findOne({isAssigned: false})
                if (testCode) {
                  const newPayment = new Payment({
                    paystackReference,
                    madeBy: sourceUser._id,
                    testCode: testCode._id
                  })
                  const payment = await newPayment.save();
                  resolve(payment)
                } else {
                  reject(new Error('no available code'))
                }
              } else {
                reject(body.data.status)
              }
            } else {
              reject(body.message);
            }
          });
        });
      }
    } catch (e) {
      return Promise.reject(e);
      // return(e);
    }
  },
}
