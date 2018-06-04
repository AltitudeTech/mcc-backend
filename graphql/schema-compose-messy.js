/*	generates a schema based on the database models for GraphQL using graphql-compose
	NOT YET COMPLETE
*/
const keystone = require('keystone');
const { GQC } = require('graphql-compose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const typeComposers = require('./composers');
const addRelationships = require('./relationships');
const addResolvers = require('./resolvers');
const addViewers = require('./viewers');

//Get logic middleware
const { candidateAccess, updateCandidateRelationshipField, createAndUpdateCandidate} = require('./logic/candidate');

const {
	UserTC, LocalGovernmentTC, StateTC,
  CandidateTC, ViewerCandidateTC
} = typeComposers;

//Add relationships and resolvers to schema
addViewers();
addRelationships();
addResolvers();

//Add fields and resolvers to rootQuery
GQC.rootQuery().addFields({
	...candidateAccess({
		viewerCandidate: ViewerCandidateTC.get('$candidateAccess')
	}),
	currentTime: {
    type: 'Date',
    resolve: () => Date.now(),
  },
	stateMany: StateTC.get('$findMany'),
	// pollById: PollTC.get('$findById'),
	// pollByIds: PollTC.get('$findByIds'),
	// pollOne: PollTC.get('$findOne'),
	// pollMany: PollTC.get('$findMany'),
	// pollTotal: PollTC.get('$count'),
});

//Add fields and resolvers to rootQuery
GQC.rootMutation().addFields({
	//userCreate: UserTC.get('$createOne'),
	loginCandidate: CandidateTC.get('$loginWithPhone'),
	...candidateAccess({
		candidateUpdateById: CandidateTC.get('$updateById'),
		//addJobExperience: createAndUpdateCandidate( 'experience', JobExperienceTC),
		updateJobExperience: updateCandidateRelationshipField( 'experience', JobExperienceTC),
		// addJobExperience: createAndUpdateCandidate( 'experience', JobExperienceTC),
		// updateJobExperience: updateCandidateRelationshipField( 'experience', JobExperienceTC),
		// addJobExperience: createAndUpdateCandidate( 'experience', JobExperienceTC),
		// updateJobExperience: updateCandidateRelationshipField( 'experience', JobExperienceTC),
		// addJobExperience: createAndUpdateCandidate( 'experience', JobExperienceTC),
		// updateJobExperience: updateCandidateRelationshipField( 'experience', JobExperienceTC),
	}),
	stateCreate: StateTC.get('$createOne'),
  // userUpdateById: UserTC.get('$updateById'),
  //userRemoveById: UserTC.get('$removeById'),
  //userRemoveOne: UserTC.get('$removeOne'),
  //userRemoveMany: UserTC.get('$removeMany'),
});

const schema = GQC.buildSchema();

module.exports = schema;
