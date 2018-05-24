const { CandidateTC, ViewerCandidateTC } = require('../composers');

module.exports = () => {
  ViewerCandidateTC.addResolver({
  	kind: 'query',
    name: 'candidateAccess',
    type: ViewerCandidateTC,
    resolve: ({ args, context , sourceUser}) => {
  		//console.log('this outlet');
  		sourceUser.id = sourceUser._id;
      return { candidate: sourceUser }
    },
  })

  const ViewerCandidateTCFields = {
  	candidate: CandidateTC.getType()
  	//add other exclusive to candidate fields here
  }
  ViewerCandidateTC.addFields(ViewerCandidateTCFields);
}
