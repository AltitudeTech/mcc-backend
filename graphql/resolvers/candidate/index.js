const keystone = require('keystone');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CandidateTC } = require('../../composers');
const Candidate = keystone.list('Candidate').model;

module.exports = () => {
  CandidateTC.addResolver({
    kind: 'mutation',
    name: 'loginWithPhone',
    description: 'login a candidate',
    args: {phone: 'String!', password: 'String!'},
    type: CandidateTC,
    resolve: async ({ args, context }) => {
      console.log('candidate login this ----');
      const { phone, password } = args;
      //console.log(context);
      return Candidate.findOne({phone}).then((candidate) => {
        if (candidate) {
          // validate password
          return bcrypt.compare(password, candidate.password).then((res) => {
            if (res) {
              // create jwt
              const token = jwt.sign({
                id: candidate.id,
                //email: candidate.email,
                phone: candidate.phone,
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
        return Promise.reject('phone/candidate not found');
      });
    },
  })

  CandidateTC.addResolver({
    kind: 'mutation',
    name: 'signUp',
    description: 'signUp a candidate',
    args: {firstName: 'String!', lastName: 'String!', phone: 'String!', password: 'String!'},
    type: CandidateTC,
    resolve: async ({ args, context }) => {
      // console.log('candidate signUp this ----');
      const { firstName, lastName, phone, password } = args;

      return Candidate.findOne({phone}).then((existing) => {
        if (!existing) {
          // hash password and create user
          const newCandidate = new Candidate({
            phone,
            password: password,
            name: {
              first: firstName,
              last: lastName
            }
          })
          return newCandidate.save().then((candidate)=>{
            const { id, phone } = candidate;
            const token = jwt.sign({
              id: candidate.id,
              //email: candidate.email,
              phone: candidate.phone,
              type: 'Candidate',
              //passwordVersion: candidate.passwordVersion,
            }, process.env.JWT_SECRET);
            // console.log('-----' + candidate.password);
            candidate.jwt = token;
            context.candidate = Promise.resolve(candidate);
            return candidate;
          })
          /*return bcrypt.hash(password, 10).then(hash =>
            Candidate.create({
            phone,
            password: hash,
            name: {
              first: firstName,
              last: lastName
            }
          })).then((candidate) => {
            const { id, phone } = candidate;
            console.log('---' + hash);
            const token = jwt.sign({
              id: candidate.id,
              //email: candidate.email,
              phone: candidate.phone,
              type: 'Candidate',
              //passwordVersion: candidate.passwordVersion,
            }, process.env.JWT_SECRET);
            console.log('-----' + candidate.password);
            candidate.jwt = token;
            context.candidate = Promise.resolve(candidate);
            return candidate;
          });*/
        }
        return Promise.reject('phone already Exists');
      })
    },
  })
}
