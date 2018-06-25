const keystone = require('keystone');
const { CandidateTC } = require('../../composers');
const jwt = require('jsonwebtoken');
const Candidate = keystone.list('Candidate').model;

module.exports = {
  kind: 'mutation',
  name: 'signUp',
  description: 'signUp a candidate',
  args: {firstName: 'String!', lastName: 'String!', email: 'String!', phone: 'String!' ,password: 'String!'},
  type: CandidateTC,
  resolve: async ({ args, context }) => {
    // console.log('candidate signUp this ----');
    const { firstName, lastName, email, phone, password } = args;
    return Candidate.findOne({email}).then((existing) => {
      if (!existing) {
        // hash password and create user
        return Candidate.findOne({phone}).then((foundPhone) => {
          if(!foundPhone){
            const newCandidate = new Candidate({
              email,
              password,
              phone,
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
              candidate.jwt = token;
              context.candidate = Promise.resolve(candidate);
              return candidate;
            }).catch((err) => {
              return Promise.reject('Cannot create record, Please try again');
            })
          }
          return Promise.reject('Phone already Exists');
        })
      }
      return Promise.reject('Email already Exists');
    })
  }
};
