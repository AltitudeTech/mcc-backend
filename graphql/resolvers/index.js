const candidateResolvers = require('./candidate')
const institutionResolvers = require('./institution')
const AdminResolvers = require('./admin')

module.exports = addResolvers = () => {
  candidateResolvers();
  institutionResolvers();
  AdminResolvers();
}
