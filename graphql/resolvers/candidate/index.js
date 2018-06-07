const keystone = require('keystone');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
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
      return Candidate.findOne({email}).then((candidate) => {
        if (candidate) {
          // validate password
          return bcrypt.compare(password, candidate.password).then((res) => {
            if (res) {
              // create jwt
              const token = jwt.sign({
                id: candidate.id,
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
    },
  })

  CandidateTC.addResolver({
    kind: 'mutation',
    name: 'activateAccount',
    description: 'Activate Candidate account',
    args: {code: 'String!'},
    type: CandidateTC,
    resolve: async ({ args, context }) => {
      // console.log('candidate activate');
      const { code } = args;
      jwt.verify(code, process.env.ACTIVATION_JWT_SECRET, (err, data)=>{
        if (err) {
          throw err;
        } else {
          const { id, createdAt } = data;
          if (id) {
            if (createdAt && !moment(createdAt).isAfter(moment().subtract(24, 'hours'))) {
              return Candidate.findByIdAndUpdate(id, {isVerified: true}).then(candidate=>{
                const { id, email } = candidate;
                const token = jwt.sign({
                  id: candidate.id,
                  email: candidate.email,
                  type: 'Candidate',
                  //passwordVersion: candidate.passwordVersion,
                }, process.env.JWT_SECRET);
                candidate.jwt = token;
                context.candidate = Promise.resolve(candidate);
                return candidate;
              })
            } else {
              return new Error('expired token')
            }
          } else {
            return new Error('invalid token')
          }
        }
      })
    },
  })
}
