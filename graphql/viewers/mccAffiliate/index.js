const { MccAffiliateTC, ViewerMccAffiliateTC } = require('../../composers');

module.exports = () => {
  ViewerMccAffiliateTC.addResolver({
  	kind: 'query',
    name: 'mccAffiliateAccess',
    type: ViewerMccAffiliateTC,
    resolve: ({ args, context , sourceUser}) => {
  		//console.log('assign mccAffiliate from jwt to response');
      return { mccAffiliate: sourceUser }
    },
  })

  const ViewerMccAffiliateTCFields = {
  	mccAffiliate: MccAffiliateTC.getType()
  	//add other exclusive to mccAffiliate fields here
  }
  ViewerMccAffiliateTC.addFields(ViewerMccAffiliateTCFields);
}
