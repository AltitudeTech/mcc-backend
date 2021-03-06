/*	generates a schema based on the database models for GraphQL using graphql-compose
	NOT YET COMPLETE
*/
const keystone = require('keystone');
const { GQC } = require('graphql-compose');

const typeComposers = require('./composers');
const addRelationships = require('./relationships');
const addResolvers = require('./resolvers');
const addViewers = require('./viewers');

//Get logic middleware
const {
	isSelf,
	updateSelf,
	//createSelfRelationship,
	updateSelfRelationship,
	//findSelfRelationship,
	deleteSelfRelationship,
	createManagedRelationship,
	deleteManagedRelationship
} = require('./logic/common');

const { authAccess } = require('./logic/authentication');

const {
	UserTC,
	PollTC,
	PollVoteTC,
	LocalGovernmentTC,
	StateTC,
  CandidateTC,
	CandidateDocumentTC,
	ViewerCandidateTC,
	InstitutionTC,
	ViewerInstitutionTC,
	IndustryTC,
	AdminTC,
	ViewerAdminTC,
	PaymentTC,
	TestCodeTC,
	GuestEnquiryTC,
	NewsletterSubscriberTC,
	ViewerMccAffiliateTC,
	MccAffiliateTC,
	PriceTC,
	MccCouponTC
} = typeComposers;

//Add relationships and resolvers to schema
addViewers();
addRelationships();
addResolvers();

//Add fields and resolvers to rootQuery
GQC.rootQuery().addFields({
	// user: UserTC.getResolver('findOne'),
	...authAccess({sourceUserType: 'User'}, {
		price: PriceTC.getResolver('latestPrice'),
		userIsAuthenticated: UserTC.getResolver('isAuthenticated'),
	}),
	...authAccess({sourceUserType: 'Candidate'}, {
		candidateIsAuthenticated: UserTC.getResolver('isAuthenticated'),
    viewerCandidate: ViewerCandidateTC.getResolver('candidateAccess'),
		candidateFindCoupon: MccCouponTC.getResolver('findCoupon')
	}),
	...authAccess({sourceUserType: 'Candidate', isActivated: true}, {
    isActivatedViewerCandidate: ViewerCandidateTC.getResolver('candidateAccess'),
	}),
	...authAccess({sourceUserType: 'Institution'}, {
		institutionIsAuthenticated: UserTC.getResolver('isAuthenticated'),
		viewerInstitution: ViewerInstitutionTC.getResolver('institutionAccess'),
		//industryMany: IndustryTC.getResolver('findMany'),
		// jobById: isSelf(JobTC, '$findById'),
		// jobById: JobTC.getResolver('findById'),
		//institutionJobById: findSelfRelationship('jobs', JobTC),
		// institutionJobsPagination: findSelfRelationship('jobs', JobTC),
	}),
	...authAccess({sourceUserType: 'MccAffiliate'}, {
		mccAffiliateIsAuthenticated: UserTC.getResolver('isAuthenticated'),
		viewerMccAffiliate: ViewerMccAffiliateTC.getResolver('mccAffiliateAccess'),
	}),
	...authAccess({sourceUserType: 'Admin'}, {
		viewerAdmin: ViewerAdminTC.getResolver('adminAccess'),
		// managerCandidateById: CandidateTC.getResolver('findById'),
	}),
	currentTime: {
		type: 'Date',
		resolve: () => new Date().toISOString(),
	},
});

//Add fields and resolvers to rootQuery
GQC.rootMutation().addFields({

	// unauthorized User Mutations
	createEnquiry: GuestEnquiryTC.getResolver('createOne'),
	subscribeToNewsletter: NewsletterSubscriberTC.getResolver('subscribe'),
	// unsubscribeNewsletter: NewsletterSubscriberTC.getResolver('unsubscribe'),

	loginUser: UserTC.getResolver('loginWithEmail'),
	userActivateAccount: UserTC.getResolver('activateAccount'),

	// unauthorized Candidate Mutations
	candidateCreateAccount: CandidateTC.getResolver('createAccount'),
	candidateActivateAccount: CandidateTC.getResolver('activateAccount'),

	// unauthorized Institution Mutations
	institutionCreateAccount: InstitutionTC.getResolver('createAccount'),
	institutionActivateAccount: InstitutionTC.getResolver('activateAccount'),

	affiliateCreateAccount: MccAffiliateTC.getResolver('createAccount'),
	// loginAdmin: AdminTC.getResolver('loginWithPhone'),
	// signUpAdmin: AdminTC.getResolver('signUp'),

	//authorized User Mutations
	...authAccess({sourceUserType: 'Candidate'}, {
		candidateResendActivationLink: UserTC.getResolver('sendUserActivationLink'),
		candidateUpdateSelf: updateSelf({TC: CandidateTC}),
		candidateFindOrCreatePaymentRecord: PaymentTC.getResolver('findOrCreatePaymentV2'),
		candidateFindOrCreatePaymentRecordOld: PaymentTC.getResolver('findOrCreatePayment'),
	}),
	...authAccess({sourceUserType: 'Institution'}, {
		institutionResendActivationLink: UserTC.getResolver('sendUserActivationLink'),
		institutionUpdateSelf: updateSelf({TC: InstitutionTC}),
		// institutionFindOrCreatePaymentRecord: PaymentTC.getResolver('findOrCreatePayment'),
	}),
	...authAccess({sourceUserType: 'MccAffiliate'}, {
		affiliateResendActivationLink: UserTC.getResolver('sendUserActivationLink'),
		affiliateCreateCoupon: MccAffiliateTC.getResolver('createCoupon'),
		// affiliateCreateCoupon: createModelWithReference({TC: MccCouponTC, refPath: 'affiliate'}),
		affiliateUpdateSelf: updateSelf({TC: MccAffiliateTC}),
	}),
//	...authAccess({sourceUserType: 'Admin'}, {
		// addCandidateDocument: createManagedRelationship( 'documentsUploaded', CandidateDocumentTC, 'Candidate'),
		// deleteCandidateDocument: deleteManagedRelationship( 'documentsUploaded', CandidateDocumentTC, 'Candidate'),
		// addCandidateCaseFile: createManagedRelationship( 'caseFiles', CaseFileTC, 'Candidate'),
		// addCandidateDocument: createSelfRelationship( 'referees', CandidateDocumentTC),
		// deleteCandidateDocument: deleteSelfRelationship( 'referees', CandidateDocumentTC),
//	})
});

const schema = GQC.buildSchema();
module.exports = schema;
