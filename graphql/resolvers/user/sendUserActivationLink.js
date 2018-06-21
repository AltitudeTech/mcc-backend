const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const User = keystone.list('User').model;
const { UserTC } = require('../../composers');
const moment = require('moment');

// activateAccount resolver for user
module.exports = {
  kind: 'mutation',
  name: 'sendUserActivationLink',
  description: 'Send account activation link to user email',
  args: {code: 'String'},
  type: UserTC,
  resolve: async ({ args, context, sourceUserType, sourceUser }) => {
    try {
      console.log("sending email");
    	if (this.isActivated) {
    		console.log('Account is already activated');
    		throw new Error('Account is already activated');
    	}

      if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
      	console.log('Unable to send email - no mailgun credentials provided');
      	throw new Error('could not find mailgun credentials');
      }

      if (!process.env.ACTIVATION_JWT_SECRET) {
      	console.log('Unable to generate activation code - no ACTIVATION_JWT_SECRET provided');
      	throw new Error('could not find ACTIVATION_JWT_SECRET');
      }

      const user = sourceUser;
    	const brand = keystone.get('brand');

    	const code = jwt.sign({
    		id: this._id,
    		createdAt: Date.now(),
    	}, process.env.ACTIVATION_JWT_SECRET);
      const baseURL = process.env.BASE_URL || `http://localhost:${ process.env.PORT || '3000' }`
    	const activationLink = `${baseURL}/activate?code=${code}`

      return new Promise((resolve, reject)=>{
        new keystone.Email({
          templateName: 'activate-account',
          transport: 'mailgun',
        }).send({
          to: [user.email],
          from: {
            name: 'WeberHub',
            email: 'no-reply@webercub.com',
          },
          subject: 'MCC Account Activation',
          user,
          brand,
          activationLink
        }, (err) => {
          if (err) {
            reject(err)
          }
          resolve(user)
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  },
}
