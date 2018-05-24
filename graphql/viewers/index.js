const candidateViewer = require('./candidate');
const companyViewer = require('./company');
const centerManagerViewer = require('./centerManager');

const addViewers = module.exports = () => {
  candidateViewer();
  companyViewer();
  centerManagerViewer();
};
