const candidateViewer = require('./candidate');
const institutionViewer = require('./institution');
const adminViewer = require('./admin');
const mccAffiliateViewer = require('./mccAffiliate');

const addViewers = module.exports = () => {
  candidateViewer();
  institutionViewer();
  mccAffiliateViewer();
  adminViewer();
};
