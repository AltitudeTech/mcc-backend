const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { UserTC } = require('../../composers');
const User = keystone.list('User').model;

module.exports = () => {
  UserTC.addResolver({
    kind: 'mutation',
    name: 'loginWithEmail',
    description: 'login a user',
    args: {email: 'String!', password: 'String!'},
    type: UserTC,
    resolve: async ({ args, context }) => {
      // console.log('user login this ----');
      const { email, password } = args;
      try {
        const user = await User.findOne({email});
        if (user) {
          // validate password
          return new Promise((resolve, reject)=>{
            user._.password.compare(password, (err, isMatch) => {
              if (isMatch) {
                // create jwt
                const token = jwt.sign({
                  id: user.id,
                  email: user.email,
                  type: user.__t ? user.__t : '',
                  //passwordVersion: user.passwordVersion,
                }, process.env.JWT_SECRET);
                user.jwt = token;
                context.user = Promise.resolve(user);
                resolve(user);
              }
              reject('password incorrect');
            });
          });
        }
        return Promise.reject('email/user not found');
      } catch (e) {
        Promise.reject(e);
      }
    },
  })

  UserTC.addResolver({
    kind: 'mutation',
    name: 'activateAccount',
    description: 'Activate User account',
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
  })
}
