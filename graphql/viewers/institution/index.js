const { InstitutionTC, ViewerInstitutionTC } = require('../../composers');

module.exports = () => {
  ViewerInstitutionTC.addResolver({
  	kind: 'query',
    name: 'institutionAccess',
    type: ViewerInstitutionTC,
    resolve: ({ args, context , sourceUser}) => {
  		//console.log('this user');
  		sourceUser.id = sourceUser._id;
      return { institution: sourceUser }
    },
  })

  const ViewerInstitutionTCFields = {
  	institution: InstitutionTC.getType()
  	//add other exclusive to institution fields here
  }
  ViewerInstitutionTC.addFields(ViewerInstitutionTCFields);
}
