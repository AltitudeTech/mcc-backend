const keystone = require('keystone');
const { InstitutionTC } = require('../../composers');
const jwt = require('jsonwebtoken');
const Institution = keystone.list('Institution').model;

module.exports = {
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
}
