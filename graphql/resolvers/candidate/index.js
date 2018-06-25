const { CandidateTC } = require('../../composers');

module.exports = () => {

  CandidateTC.addResolver(require('./signUp'))

  CandidateTC.addResolver(require('./activateAccount'))
}
