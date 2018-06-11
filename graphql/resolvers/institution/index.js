const keystone = require('keystone');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const { InstitutionTC } = require('../../composers');
const Institution = keystone.list('Institution').model;

module.exports = () => {
  InstitutionTC.addResolver({
    kind: 'mutation',
    name: 'loginWithEmail',
    description: 'login an institution',
    args: {email: 'String!', password: 'String!'},
    type: InstitutionTC,
    resolve: async ({ args, context }) => {
      const { email, password } = args;
      //console.log(context);
      return Institution.findOne({email}).then((institution) => {
        if (institution) {
          // validate password
          return bcrypt.compare(password, institution.password).then((res) => {
            if (res) {
              // create jwt
              const token = jwt.sign({
                id: institution.id,
                email: institution.email,
                type: 'Institution',
                passwordVersion: institution.passwordVersion,
              }, process.env.JWT_SECRET);
              institution.jwt = token;
              context.institution = Promise.resolve(institution);
              return institution;
            }
            return Promise.reject('password incorrect');
          });
        }
        return Promise.reject('email/institution not found');
      });
    },
  })

  InstitutionTC.addResolver({
    kind: 'mutation',
    name: 'signUp',
    description: 'signUp a institution',
    args: {name: 'String!', email: 'String!', password: 'String!'},
    type: InstitutionTC,
    resolve: async ({ args, context }) => {
      // console.log('institution signUp this ----');
      const { name, email, password } = args;

      return Institution.findOne({email}).then((existing) => {
        if (!existing) {
          // hash password and create user
          const newInstitution = new Institution({
            name,
            email,
            password
          })
          return newInstitution.save().then((institution)=>{
            const { id, email } = institution;
            const token = jwt.sign({
              id: institution.id,
              email: institution.email,
              type: 'Institution',
              passwordVersion: institution.passwordVersion,
            }, process.env.JWT_SECRET);
            institution.jwt = token;
            context.institution = Promise.resolve(institution);
            return institution;
          })
        }
        return Promise.reject('email already Exists');
      })
    },
  })
}
