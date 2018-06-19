const userResolvers = require('./user')
const candidateResolvers = require('./candidate')
const placeholderResolvers = require('./placeholder')
// const institutionResolvers = require('./institution')
// const AdminResolvers = require('./admin')

module.exports = addResolvers = () => {
  userResolvers();
  placeholderResolvers();
  candidateResolvers();
  // institutionResolvers();
  // AdminResolvers();
}
