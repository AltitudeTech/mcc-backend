const keystone = require('keystone');
// const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { CandidateTC } = require('../../composers');
const Candidate = keystone.list('Candidate').model;

module.exports = () => {
  // CandidateTC.addResolver({
  //   kind: 'mutation',
  //   name: 'loginWithEmail',
  //   description: 'login a candidate',
  //   args: {email: 'String!', password: 'String!'},
  //   type: CandidateTC,
  //   resolve: async ({ args, context }) => {
  //     // console.log('candidate login this ----');
  //     const { email, password } = args;
  //     return Candidate.findOne({email}).then((candidate) => {
  //       if (candidate) {
  //         // validate password
  //         return bcrypt.compare(password, candidate.password).then((res) => {
  //           if (res) {
  //             // create jwt
  //             const token = jwt.sign({
  //               id: candidate.id,
  //               email: candidate.email,
  //               type: 'Candidate',
  //               //passwordVersion: candidate.passwordVersion,
  //             }, process.env.JWT_SECRET);
  //             candidate.jwt = token;
  //             context.candidate = Promise.resolve(candidate);
  //             return candidate;
  //           }
  //           return Promise.reject('password incorrect');
  //         });
  //       }
  //       return Promise.reject('email/candidate not found');
  //     });
  //   },
  // })

  CandidateTC.addResolver({
    kind: 'query',
    name: 'isAuthenticated',
    description: 'returns true if candidate is authenticated',
    type: 'Boolean',
    resolve: () => true
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
      try {
        const data = jwt.verify(code, process.env.ACTIVATION_JWT_SECRET);
        const { id, createdAt } = data;
        if (id) {
          if (createdAt && moment(createdAt).isAfter(moment().subtract(24, 'hours'))) {
            const candidate = await Candidate.findOne({_id: id});
            if (candidate.isActivated) {
              throw Error('activated account')
            } else {
              candidate.isActivated = true;
              await candidate.save();
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
          } else {
            throw Error('expired token')
          }
        } else {
          throw Error('invalid token')
        }
      } catch (e) {
        throw e;
      }
      // jwt.verify(code, process.env.ACTIVATION_JWT_SECRET, (err, data)=>{
      //   if (err) {
      //     throw err;
      //   } else {
      //     const { id, createdAt } = data;
      //     if (id) {
      //       if (createdAt && moment(createdAt).isAfter(moment().subtract(24, 'hours'))) {
      //         try {
      //           const candidate = await Candidate.findOne({_id: id});
      //           if (candidate.isActivated) {
      //             throw Error('activated account')
      //           } else {
      //             candidate.isActivated = true;
      //             await candidate.save();
      //             console.log(candidate);
      //             return candidate;
      //           }
      //         } catch (e) {
      //           throw Error(e)
      //         }
      //         // return Candidate.findByIdAndUpdate(id, {isActivated: true}).then(candidate=>{
      //         //   const { id, email } = candidate;
      //         //   const token = jwt.sign({
      //         //     id: candidate.id,
      //         //     email: candidate.email,
      //         //     type: 'Candidate',
      //         //     //passwordVersion: candidate.passwordVersion,
      //         //   }, process.env.JWT_SECRET);
      //         //   console.log(token);
      //         //   candidate.jwt = token;
      //         //   candidate.y = 'token';
      //         //   context.candidate = Promise.resolve(candidate);
      //         //   console.log(candidate);
      //         //   // console.log(context);
      //         //   console.log('asd');
      //         //   return candidate;
      //         // })
      //       } else {
      //         throw Error('expired token')
      //       }
      //     } else {
      //       throw Error('invalid token')
      //     }
      //   }
      // })
    },
  })
}
