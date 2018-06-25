const keystone = require('keystone');
const { CandidateTC } = require('../../composers');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Candidate = keystone.list('Candidate').model;

module.exports = {
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
  }
}
