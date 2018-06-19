const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const User = keystone.list('User').model;
const { UserTC } = require('../../composers');

// loginWithEmail resolver for user
module.exports = {
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
            if (err) {
              reject(err);
            }
            if (isMatch) {
              // create jwt
              const token = jwt.sign({
                _id: user._id,
                email: user.email,
                type: user.__t ? user.__t : 'User',
                //passwordVersion: user.passwordVersion,
              }, process.env.JWT_SECRET);
              // context.user = Promise.resolve(user);
              resolve({
                name: user.name,
                jwt: token
              });
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
}
