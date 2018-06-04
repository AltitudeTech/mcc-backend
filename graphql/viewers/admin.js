const { AdminTC, ViewerAdminTC } = require('../composers');

module.exports = () => {
  ViewerAdminTC.addResolver({
  	kind: 'query',
    name: 'adminAccess',
    type: ViewerAdminTC,
    resolve: ({ args, context , sourceUser}) => {
  		//console.log('this outlet');
  		sourceUser.id = sourceUser._id;
      return { admin: sourceUser }
    },
  })

  const ViewerAdminTCFields = {
  	admin: AdminTC.getType()
  	//add other exclusive to admin fields here
  }
  ViewerAdminTC.addFields(ViewerAdminTCFields);
}
