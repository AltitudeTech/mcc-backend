const { CandidateTC } = require('../../composers');

module.exports = () => {

  CandidateTC.addResolver(require('./createAccount'))

  CandidateTC.addResolver(require('./activateAccount'))
}
