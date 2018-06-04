const candidateViewer = require('./candidate');
const institutionViewer = require('./institution');
const adminViewer = require('./admin');

const addViewers = module.exports = () => {
  candidateViewer();
  institutionViewer();
  adminViewer();
};
