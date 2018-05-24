const { CenterManagerTC, ViewerCenterManagerTC } = require('../composers');

module.exports = () => {
  ViewerCenterManagerTC.addResolver({
  	kind: 'query',
    name: 'centerManagerAccess',
    type: ViewerCenterManagerTC,
    resolve: ({ args, context , sourceUser}) => {
  		//console.log('this outlet');
  		sourceUser.id = sourceUser._id;
      return { centerManager: sourceUser }
    },
  })

  const ViewerCenterManagerTCFields = {
  	centerManager: CenterManagerTC.getType()
  	//add other exclusive to centerManager fields here
  }
  ViewerCenterManagerTC.addFields(ViewerCenterManagerTCFields);
}
