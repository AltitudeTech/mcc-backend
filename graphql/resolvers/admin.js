const keystone = require('keystone');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AdminTC } = require('../composers');
const Admin = keystone.list('Admin').model;

module.exports = () => {
  AdminTC.addResolver({
    kind: 'mutation',
    name: 'loginWithPhone',
    description: 'login a centre manager',
    args: {phone: 'String!', password: 'String!'},
    type: AdminTC,
    resolve: async ({ args, context }) => {
      console.log('centre manager login this ----');
      const { phone, password } = args;
      //console.log(context);
      return Admin.findOne({phone}).then((admin) => {
        if (admin) {
          // validate password
          return bcrypt.compare(password, admin.password).then((res) => {
            if (res) {
              // create jwt
              const token = jwt.sign({
                id: admin.id,
                //email: admin.email,
                phone: admin.phone,
                type: 'Admin',
                //passwordVersion: admin.passwordVersion,
              }, process.env.JWT_SECRET);
              admin.jwt = token;
              context.admin = Promise.resolve(admin);
              return admin;
            }
            return Promise.reject('password incorrect');
          });
        }
        return Promise.reject('phone/admin not found');
      });
    },
  })

  AdminTC.addResolver({
    kind: 'mutation',
    name: 'signUp',
    description: 'signUp a admin',
    args: {firstName: 'String!', lastName: 'String!', phone: 'String!', password: 'String!'},
    type: AdminTC,
    resolve: async ({ args, context }) => {
      // console.log('admin signUp this ----');
      const { firstName, lastName, phone, password } = args;

      return Admin.findOne({phone}).then((existing) => {
        if (!existing) {
          // hash password and create user
          const newAdmin = new Admin({
            phone,
            password: password,
            name: {
              first: firstName,
              last: lastName
            }
          })
          return newAdmin.save().then((admin)=>{
            const { id, phone } = admin;
            const token = jwt.sign({
              id: admin.id,
              //email: admin.email,
              phone: admin.phone,
              type: 'Admin',
              //passwordVersion: admin.passwordVersion,
            }, process.env.JWT_SECRET);
            // console.log('-----' + admin.password);
            admin.jwt = token;
            context.admin = Promise.resolve(admin);
            return admin;
          })
          /*return bcrypt.hash(password, 10).then(hash =>
            Admin.create({
            phone,
            password: hash,
            name: {
              first: firstName,
              last: lastName
            }
          })).then((admin) => {
            const { id, phone } = admin;
            console.log('---' + hash);
            const token = jwt.sign({
              id: admin.id,
              //email: admin.email,
              phone: admin.phone,
              type: 'Admin',
              //passwordVersion: admin.passwordVersion,
            }, process.env.JWT_SECRET);
            console.log('-----' + admin.password);
            admin.jwt = token;
            context.admin = Promise.resolve(admin);
            return admin;
          });*/
        }
        return Promise.reject('phone already Exists');
      })
    },
  })
}
