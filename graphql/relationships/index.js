const addRelationships = module.exports = () => {
  require('./payment')();
  require('./candidate')();
  require('./mccAffiliate')();
};
