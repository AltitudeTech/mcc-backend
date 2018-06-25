const keystone = require('keystone');
const Payment = keystone.list('Payment').model;
const TestCode = keystone.list('TestCode').model;
const { PaymentTC } = require('../../composers');

if (!process.env.PAYSTACK_SECRET_KEY){
  console.error('PAYSTACK_SECRET_KEY is missing from env');
}
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

// loginWithEmail resolver for user
module.exports = {
  kind: 'mutation',
  name: 'findOrCreatePayment',
  description: 'find or verifies a payment and assign a test code',
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
          paystack.transaction.verify(paystackReference, async (error, body) => {
            if (error) {
              //possible Error - connect ETIMEDOUT 104.16.6.25:443
              reject(error)
            }
            // console.log(body);
            if (body.status){
              if (body.data.status=="success") {
                //find code and add to payment
                const assignedCode = await TestCode.findOne({assignedToPayment: paystackReference})
                if (assignedCode) {
                  console.log('assignedCode');
                  const newPayment = new Payment({
                    paystackReference,
                    madeBy: sourceUser._id
                  })
                  // const payment = await ;
                  resolve(newPayment.save());
                } else {
                  // assign payment reference to test code
                  const testCode = await TestCode.findOneAndUpdate({assignedToPayment: null}, {assignedToPayment: paystackReference})
                  if (testCode) {
                    const newPayment = new Payment({
                      paystackReference,
                      madeBy: sourceUser._id
                    })
                    resolve(newPayment.save());
                  } else {
                    reject(new Error('no available code'))
                  }
                }
              } else {
                console.log(body);
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
    }
  },
}
