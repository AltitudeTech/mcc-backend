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
	authAccess,
	updateSelf,
	//createSelfRelationship,
	updateSelfRelationship,
	//findSelfRelationship,
	deleteSelfRelationship,
	createManagedRelationship,
	deleteManagedRelationship
} = require('./logic/common');

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
	TestCodeTC
} = typeComposers;

//Add relationships and resolvers to schema
addViewers();
addRelationships();
addResolvers();

//Add fields and resolvers to rootQuery
GQC.rootQuery().addFields({
	// user: UserTC.getResolver('findOne'),
	...authAccess({sourceUserType: 'Candidate'}, {
		candidateIsAuthenticated: UserTC.getResolver('isAuthenticated'),
    viewerCandidate: ViewerCandidateTC.getResolver('candidateAccess'),
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
	...authAccess({sourceUserType: 'Admin'}, {
		viewerAdmin: ViewerAdminTC.getResolver('adminAccess'),
		managerCandidateById: CandidateTC.getResolver('findById'),
	}),
	currentTime: {
		type: 'Date',
		resolve: () => new Date().toISOString(),
	},
});

//Add fields and resolvers to rootQuery
GQC.rootMutation().addFields({
	// removeuser: UserTC.getResolver('removeById'),
	loginUser: UserTC.getResolver('loginWithEmail'),

	signUpCandidate: CandidateTC.getResolver('signUp'),
	activateCandidateAccount: CandidateTC.getResolver('activateAccount'),
	signUpInstitution: InstitutionTC.getResolver('signUp'),
	activateInstitutionAccount: InstitutionTC.getResolver('activateAccount'),
	// loginAdmin: AdminTC.getResolver('loginWithPhone'),
	// signUpAdmin: AdminTC.getResolver('signUp'),
	...authAccess({sourceUserType: 'Candidate'}, {
		candidateUpdateSelf: updateSelf({TC: CandidateTC}),
		findOrCreatePaymentRecord: PaymentTC.getResolver('findOrCreatePayment'),
		// createPaymentRecord: PaymentTC.getResolver('createOne'),
		// addJobExperience: createSelfRelationship( 'experience', JobExperienceTC),
		// updateJobExperience: updateSelfRelationship( 'experience', JobExperienceTC),
		// deleteJobExperience: deleteSelfRelationship( 'experience', JobExperienceTC),
		// addEducation: createSelfRelationship( 'education', EducationTC),
		// updateEducation: updateSelfRelationship( 'education', EducationTC),
		// deleteEducation: deleteSelfRelationship( 'education', EducationTC),
		// addCertificate: createSelfRelationship( 'certificates', CertificateTC),
		// updateCertificate: updateSelfRelationship( 'certificates', CertificateTC),
		// deleteCertificate: deleteSelfRelationship( 'certificates', CertificateTC),
		// addReferee: createSelfRelationship( 'referees', RefereeTC),
		// updateReferee: updateSelfRelationship( 'referees', RefereeTC),
		// deleteReferee: deleteSelfRelationship( 'referees', RefereeTC),
	}),
	...authAccess({sourceUserType: 'Institution'}, {
		candidateUpdateSelf: updateSelf({TC: CandidateTC}),
		// institutionUpdateById:updateSelf(InstitutionTC),
		// addJob: createSelfRelationship( 'jobs', JobTC),
		// updateJob: updateSelfRelationship( 'jobs', JobTC),
		// deleteJob: deleteSelfRelationship( 'jobs', JobTC),
		// createInstitutionMessage: InstitutionMessageTC.getResolver('createOne'),
		// addJobExperience: createSelfRelationship( 'experience', JobExperienceTC),
		// updateJobExperience: updateSelfRelationship( 'experience', JobExperienceTC),
		// deleteJobExperience: deleteSelfRelationship( 'experience', JobExperienceTC),
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
