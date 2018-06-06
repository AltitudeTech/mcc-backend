const keystone = require('keystone');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CandidateTC } = require('../../composers');
const Candidate = keystone.list('Candidate').model;

module.exports = () => {
  CandidateTC.addResolver({
    kind: 'mutation',
    name: 'loginWithEmail',
    description: 'login a candidate',
    args: {email: 'String!', password: 'String!'},
    type: CandidateTC,
    resolve: async ({ args, context }) => {
      // console.log('candidate login this ----');
      const { email, password } = args;
      //console.log(context);
      return Candidate.findOne({email}).then((candidate) => {
        if (candidate) {
          // validate password
          return bcrypt.compare(password, candidate.password).then((res) => {
            if (res) {
              // create jwt
              const token = jwt.sign({
                id: candidate.id,
                //email: candidate.email,
                email: candidate.email,
                type: 'Candidate',
                //passwordVersion: candidate.passwordVersion,
              }, process.env.JWT_SECRET);
              candidate.jwt = token;
              context.candidate = Promise.resolve(candidate);
              return candidate;
            }
            return Promise.reject('password incorrect');
          });
        }
        return Promise.reject('email/candidate not found');
      });
    },
  })

  CandidateTC.addResolver({
    kind: 'mutation',
    name: 'signUp',
    description: 'signUp a candidate',
    args: {firstName: 'String!', lastName: 'String!', email: 'String!', password: 'String!'},
    type: CandidateTC,
    resolve: async ({ args, context }) => {
      // console.log('candidate signUp this ----');
      const { firstName, lastName, email, password } = args;

      return Candidate.findOne({email}).then((existing) => {
        if (!existing) {
          // hash password and create user
          const newCandidate = new Candidate({
            email,
            password: password,
            name: {
              first: firstName,
              last: lastName
            }
          })
          return newCandidate.save().then((candidate)=>{
            const { id, email } = candidate;
            const token = jwt.sign({
              id: candidate.id,
              //email: candidate.email,
              email: candidate.email,
              type: 'Candidate',
              //passwordVersion: candidate.passwordVersion,
            }, process.env.JWT_SECRET);
            // console.log('-----' + candidate.password);
            candidate.jwt = token;
            context.candidate = Promise.resolve(candidate);
            return candidate;
          })
        }
        return Promise.reject('email already Exists');
      })
    },
  })
}
