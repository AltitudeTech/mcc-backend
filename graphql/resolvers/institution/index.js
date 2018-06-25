const { InstitutionTC } = require('../../composers');

module.exports = () => {
  InstitutionTC.addResolver(require('./signUp'))
  InstitutionTC.addResolver(require('./activateAccount'))
}
