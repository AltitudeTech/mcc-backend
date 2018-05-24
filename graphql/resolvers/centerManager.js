const keystone = require('keystone');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CenterManagerTC } = require('../composers');
const CenterManager = keystone.list('CenterManager').model;

module.exports = () => {
  CenterManagerTC.addResolver({
    kind: 'mutation',
    name: 'loginWithPhone',
    description: 'login a centre manager',
    args: {phone: 'String!', password: 'String!'},
    type: CenterManagerTC,
    resolve: async ({ args, context }) => {
      console.log('centre manager login this ----');
      const { phone, password } = args;
      //console.log(context);
      return CenterManager.findOne({phone}).then((centerManager) => {
        if (centerManager) {
          // validate password
          return bcrypt.compare(password, centerManager.password).then((res) => {
            if (res) {
              // create jwt
              const token = jwt.sign({
                id: centerManager.id,
                //email: centerManager.email,
                phone: centerManager.phone,
                type: 'CenterManager',
                //passwordVersion: centerManager.passwordVersion,
              }, process.env.JWT_SECRET);
              centerManager.jwt = token;
              context.centerManager = Promise.resolve(centerManager);
              return centerManager;
            }
            return Promise.reject('password incorrect');
          });
        }
        return Promise.reject('phone/centerManager not found');
      });
    },
  })

  CenterManagerTC.addResolver({
    kind: 'mutation',
    name: 'signUp',
    description: 'signUp a centerManager',
    args: {firstName: 'String!', lastName: 'String!', phone: 'String!', password: 'String!'},
    type: CenterManagerTC,
    resolve: async ({ args, context }) => {
      // console.log('centerManager signUp this ----');
      const { firstName, lastName, phone, password } = args;

      return CenterManager.findOne({phone}).then((existing) => {
        if (!existing) {
          // hash password and create user
          const newCenterManager = new CenterManager({
            phone,
            password: password,
            name: {
              first: firstName,
              last: lastName
            }
          })
          return newCenterManager.save().then((centerManager)=>{
            const { id, phone } = centerManager;
            const token = jwt.sign({
              id: centerManager.id,
              //email: centerManager.email,
              phone: centerManager.phone,
              type: 'CenterManager',
              //passwordVersion: centerManager.passwordVersion,
            }, process.env.JWT_SECRET);
            // console.log('-----' + centerManager.password);
            centerManager.jwt = token;
            context.centerManager = Promise.resolve(centerManager);
            return centerManager;
          })
          /*return bcrypt.hash(password, 10).then(hash =>
            CenterManager.create({
            phone,
            password: hash,
            name: {
              first: firstName,
              last: lastName
            }
          })).then((centerManager) => {
            const { id, phone } = centerManager;
            console.log('---' + hash);
            const token = jwt.sign({
              id: centerManager.id,
              //email: centerManager.email,
              phone: centerManager.phone,
              type: 'CenterManager',
              //passwordVersion: centerManager.passwordVersion,
            }, process.env.JWT_SECRET);
            console.log('-----' + centerManager.password);
            centerManager.jwt = token;
            context.centerManager = Promise.resolve(centerManager);
            return centerManager;
          });*/
        }
        return Promise.reject('phone already Exists');
      })
    },
  })
}
