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
	createSelfRelationship,
	updateSelfRelationship,
	findSelfRelationship,
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
	JobExperienceTC,
	EducationTC,
	CertificateTC,
	RefereeTC,
	CompanyTC,
	CompanyMessageTC,
	ViewerCompanyTC,
	IndustryTC,
	JobTC,
	CaseFileTC,
	CenterManagerTC,
	ViewerCenterManagerTC
} = typeComposers;

//Add relationships and resolvers to schema
addViewers();
addRelationships();
addResolvers();

// console.log(CandidateDocumentTC.getInputTypeComposer().addFields({jwt: 'String'}));
// console.log(CandidateDocumentTC.getInputTypeComposer().getFields());
// const FileITC = InputTypeComposer.create({
// 	name: 'File',
// 	fields: {
// 		lastModified: 'Int',
// 		name: 'String',
// 		pre
// 	}
// });
// console.log(CandidateDocumentTC.get('$createOne').addArgs({
// 	itemId: 'String',
// 	modelType: 'String',
// 	// file: FileITC
// }).getArgs());
// console.log(CandidateDocumentTC.get('$createOne').addArgs({
// 	itemId: 'String',
// 	modelType: 'String'
// }));

//Add fields and resolvers to rootQuery
GQC.rootQuery().addFields({
	user: UserTC.get('$findOne'),
	...authAccess('Candidate', {
		viewerCandidate: ViewerCandidateTC.get('$candidateAccess')
	}),
	...authAccess('Company', {
		viewerCompany: ViewerCompanyTC.get('$companyAccess'),
		industryMany: IndustryTC.get('$findMany'),
		// jobById: isSelf(JobTC, '$findById'),
		// jobById: JobTC.get('$findById'),
		companyJobById: findSelfRelationship('jobs', JobTC),
		// companyJobsPagination: findSelfRelationship('jobs', JobTC),
	}),
	...authAccess('CenterManager', {
		viewerCenterManager: ViewerCenterManagerTC.get('$centerManagerAccess'),
		managerCandidateById: CandidateTC.get('$findById')
	}),
	currentTime: {
    type: 'Date',
    resolve: () => new Date().toISOString(),
  },
});

//Add fields and resolvers to rootQuery
GQC.rootMutation().addFields({
	user: UserTC.get('$removeById'),
	loginCandidate: CandidateTC.get('$loginWithPhone'),
	signUpCandidate: CandidateTC.get('$signUp'),
	loginCenterManager: CenterManagerTC.get('$loginWithPhone'),
	// signUpCenterManager: CenterManagerTC.get('$signUp'),
	loginCompany: CompanyTC.get('$loginWithEmail'),
	signUpCompany: CompanyTC.get('$signUp'),
	...authAccess('Candidate', {
		candidateUpdateById: updateSelf(CandidateTC),
		addJobExperience: createSelfRelationship( 'experience', JobExperienceTC),
		updateJobExperience: updateSelfRelationship( 'experience', JobExperienceTC),
		deleteJobExperience: deleteSelfRelationship( 'experience', JobExperienceTC),
		addEducation: createSelfRelationship( 'education', EducationTC),
		updateEducation: updateSelfRelationship( 'education', EducationTC),
		deleteEducation: deleteSelfRelationship( 'education', EducationTC),
		addCertificate: createSelfRelationship( 'certificates', CertificateTC),
		updateCertificate: updateSelfRelationship( 'certificates', CertificateTC),
		deleteCertificate: deleteSelfRelationship( 'certificates', CertificateTC),
		addReferee: createSelfRelationship( 'referees', RefereeTC),
		updateReferee: updateSelfRelationship( 'referees', RefereeTC),
		deleteReferee: deleteSelfRelationship( 'referees', RefereeTC),
	}),
	...authAccess('Company', {
		companyUpdateById:updateSelf(CompanyTC),
		addJob: createSelfRelationship( 'jobs', JobTC),
		updateJob: updateSelfRelationship( 'jobs', JobTC),
		deleteJob: deleteSelfRelationship( 'jobs', JobTC),
		createCompanyMessage: CompanyMessageTC.get('$createOne')
		// addJobExperience: createSelfRelationship( 'experience', JobExperienceTC),
		// updateJobExperience: updateSelfRelationship( 'experience', JobExperienceTC),
		// deleteJobExperience: deleteSelfRelationship( 'experience', JobExperienceTC),
	}),
	...authAccess('CenterManager', {
		addCandidateDocument: createManagedRelationship( 'documentsUploaded', CandidateDocumentTC, 'Candidate'),
		deleteCandidateDocument: deleteManagedRelationship( 'documentsUploaded', CandidateDocumentTC, 'Candidate'),
		addCandidateCaseFile: createManagedRelationship( 'caseFiles', CaseFileTC, 'Candidate'),
		// addCandidateDocument: createSelfRelationship( 'referees', CandidateDocumentTC),
		// deleteCandidateDocument: deleteSelfRelationship( 'referees', CandidateDocumentTC),
	})
});

const schema = GQC.buildSchema();
module.exports = schema;

/*
var fs = require('fs');
fs.writeFile("./graphql/schema.txt", JSON.stringify(schema, null, 2), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("\nThe schema was saved to schema.json!");
});
*/
