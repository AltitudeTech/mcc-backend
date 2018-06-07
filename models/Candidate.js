var keystone = require('keystone');
var Types = keystone.Field.Types;

const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * Candidate Model
 * ==========
 */
var Candidate = new keystone.List('Candidate', {
	track: true
});
Candidate.schema.set('usePushEach', true);

Candidate.add({
	name: { type: Types.Name, required: true, index: true },
	phone: { type: Types.Text, initial: true, required: true, unique: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	passwordVersion: { type: Types.Text, initial: false, required: true, default: 1 },
	isActivated: { type: Boolean, default: false }
}// , 'Details', {
// 	address: { type: Types.Text },
// 	stateOfResidence: {type: Types.Select, options: STATES},
// 	imageUrl: { type: Types.Text},
// 	bvn: { type: Types.Text},
// 	gender: {type: Types.Select, options: GENDERS},
// 	dateOfBirth: { type: Types.Date },
// 	placeOfBirth: { type: Types.Text},
// 	nationality: { type: Types.Text},
// 	stateOfOrigin: { type: Types.Text},
// }, 'Status', {
// 	isEmployed: { type: Boolean, index: true },
// 	isVerified: { type: Boolean, index: true },
// 	assignment: {type: Types.Select, options: CANDIDATE_CATEGORIES}
// }, 'Results', {
// 	result: {
// 		skillAnalysis: { type: Types.Relationship, ref: 'SkillAnalysisResult', many: false },
// 		seeker: { type: Types.Relationship, ref: 'SeekerResult', many: false },
// 		startup: { type: Types.Relationship, ref: 'StartupResult', many: false },
// 	}
// }, 'Referees', {
// 	referees: { type: Types.Relationship, ref: 'Referee', many: true },
// }, 'Qualifications', {
// 	experience: { type: Types.Relationship, ref: 'JobExperience', many: true },
// 	education: { type: Types.Relationship, ref: 'Education', many: true },
// 	certificates: { type: Types.Relationship, ref: 'Certificate', many: true },
// }, 'verification', {
// 	documentsUploaded: { type: Types.Relationship, ref: 'CandidateDocument', many: true },
// 	//documents: { type: Types.Relationship, ref: 'CandidateDocument', many: true },
// }
);

// Virtuals
// Candidate.schema.virtual('isTested').get(() => {
// 	if (this.result.seeker || this.result.startup)
// 		return true;
// 	return false;
// });
// Candidate.schema.virtual('testTaken').get(() => {
// 	if (this.result.seeker && this.result.startup)
// 		return 'both';
// 	if (this.result.seeker)
// 		return 'seeker';
// 	if (this.result.startup)
// 		return 'startup';
// 	return 'none';
// });

// Model Hooks
Candidate.schema.pre('save', function (next) {
  this.name.first = toCamelCase(this.name.first);
  this.name.last = toCamelCase(this.name.last);
  if (PHONE_REGEX.test(this.phone)){
    next();
  } else {
		next(new Error('Invalid Phone Number'));
	}
});

/**
 * Relationships
 */
//Candidate.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
Candidate.defaultColumns = 'name, phone, email';
Candidate.register();
