const candidateResolvers = require('./candidate')
const companyResolvers = require('./company')
const CenterManagerResolvers = require('./centerManager')

module.exports = addResolvers = () => {
  candidateResolvers();
  companyResolvers();
  CenterManagerResolvers();
}
