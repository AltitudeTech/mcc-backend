const userResolvers = require('./user')
const candidateResolvers = require('./candidate')
const institutionResolvers = require('./institution')
const AdminResolvers = require('./admin')

module.exports = addResolvers = () => {
  userResolvers();
  candidateResolvers();
  // institutionResolvers();
  // AdminResolvers();
}
