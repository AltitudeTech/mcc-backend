const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const User = keystone.list('User').model;
const { UserTC } = require('../../composers');
const moment = require('moment');

// activateAccount resolver for user
module.exports = {
  kind: 'mutation',
  name: 'activateAccount',
  description: 'Activate a User account',
  args: {code: 'String!'},
  type: UserTC,
  resolve: async ({ args, context }) => {
    // console.log('user activate');
    const { code } = args;
    try {
      const data = jwt.verify(code, process.env.ACTIVATION_JWT_SECRET);
      const { id, createdAt } = data;
      if (id) {
        if (createdAt && moment(createdAt).isAfter(moment().subtract(24, 'hours'))) {
          const user = await User.findOne({_id: id});
          if (user.isActivated) {
            throw Error('activated account')
          } else {
            user.isActivated = true;
            await user.save();
            const token = jwt.sign({
              id: user.id,
              email: user.email,
              type: 'User',
              //passwordVersion: user.passwordVersion,
            }, process.env.JWT_SECRET);
            user.jwt = token;
            context.user = Promise.resolve(user);
            return user;
          }
        } else {
          throw Error('expired token')
        }
      } else {
        throw Error('invalid token')
      }
    } catch (e) {
      throw e;
    }
  },
}
