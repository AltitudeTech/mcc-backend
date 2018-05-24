const { CompanyTC, ViewerCompanyTC } = require('../composers');

module.exports = () => {
  ViewerCompanyTC.addResolver({
  	kind: 'query',
    name: 'companyAccess',
    type: ViewerCompanyTC,
    resolve: ({ args, context , sourceUser}) => {
  		//console.log('this user');
  		sourceUser.id = sourceUser._id;
      return { company: sourceUser }
    },
  })

  const ViewerCompanyTCFields = {
  	company: CompanyTC.getType()
  	//add other exclusive to company fields here
  }
  ViewerCompanyTC.addFields(ViewerCompanyTCFields);
}
