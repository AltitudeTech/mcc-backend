var keystone = require('keystone');
var Types = keystone.Field.Types;

const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * Ictdata Model
 * ==========
 */
var Ictdata = new keystone.List('Ictdata', {
	track: true
});
Ictdata.schema.set('usePushEach', true);

Ictdata.add({
    Firstname:{ type: Types.Text,initial:true, required: true, index: true },
    Middlename:{ type: Types.Text,initial:true, required: true, index: true },
    Lastname:{ type: Types.Text,initial:true, required: true, index: true },
    Gender:{ type: Types.Text,initial:true, required: true, index: true },
    Day:{ type: Types.Text,initial:true, required: true, index: true },
    Month: { type: Types.Number },
    Year: { type: Types.Number },
    StateofOrigin:{type: Types.Select, options: STATES},
    GeoPolZone: { type: Types.Text },
    Email:{ type: Types.Email, initial: true, required: false, unique: true, index: true, sparse: true },
    Phone:{ type: Types.Text, initial: true, required: true},
    HighestDegreeQualification: { type: Types.Text },
    DegreeTitle: { type: Types.Text },
    Trainingtype: { type: Types.Text },
    TrainingLocation: { type: Types.Text },
    EntryDate: { type: Types.Date },
	
}// , 'Details', {
// 	address: { type: Types.Text },
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
// 	documentsUploaded: { type: Types.Relationship, ref: 'IctdataDocument', many: true },
// 	//documents: { type: Types.Relationship, ref: 'IctdataDocument', many: true },
// }
);


// Model Hooks
Ictdata.schema.pre('save', function (next) {
  this.Firstname = toCamelCase(this.Firstname);
  this.Lastname = toCamelCase(this.Lastname);
  this.Middlename = toCamelCase(this.Middlename);
  if (PHONE_REGEX.test(this.Phone)){
    next();
  } else {
		next(new Error('Invalid Phone Number'));
	}
});



/**
 * Registration
 */
Ictdata.defaultColumns = 'Firstname, Lastname, Email' ;
Ictdata.register();
