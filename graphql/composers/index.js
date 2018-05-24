const { composeWithMongoose } = require('graphql-compose-mongoose');
const keystone = require('keystone');
const { GQC, TypeComposer, InputTypeComposer  } = require('graphql-compose');

/**
* Mongoose Models
*/
const User = keystone.list('User').model;
const Poll = keystone.list('Poll').model;
const PollVote = keystone.list('PollVote').model;
const LocalGovernment = keystone.list('LocalGovernment').model;
const State = keystone.list('State').model;
const Candidate = keystone.list('Candidate').model;
const CandidateDocument = keystone.list('CandidateDocument').model;
const CenterManager = keystone.list('CenterManager').model;
const JobExperience = keystone.list('JobExperience').model;
const Education = keystone.list('Education').model;
const Company = keystone.list('Company').model;
const CompanyMessage = keystone.list('CompanyMessage').model;
const Certificate = keystone.list('Certificate').model;
const Referee = keystone.list('Referee').model;
const Industry = keystone.list('Industry').model;
const Job = keystone.list('Job').model;
const CaseFile = keystone.list('CaseFile').model;

/**
* Config
*/
const UserTCOptions = {
  fields:{
    remove: ['password', 'passwordVersion','isAdmin']
  }
};
const CandidateTCOptions = {
  fields:{
    remove: [
      'password', 'passwordVersion', 'isVerified', 'isEmployed',
       'documentsUploaded', 'caseFile'
     ]
  },
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'phone', 'result', 'category', 'password',
          'passwordVersion', 'isVerified', 'isEmployed',
          'documentsUploaded', 'caseFiles', 'referees',
          'experience', 'education', 'certificates', 'documentsUploaded'
        ]
      }
    }
  }
};
const CenterManagerTCOptions = {
  fields:{
    remove: [
      'password', 'passwordVersion', 'isVerified', 'isEmployed',
       'documentsUploaded', 'caseFile'
     ]
  },
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'phone', 'result', 'category', 'password',
          'passwordVersion', 'isVerified', 'isEmployed',
          'documentsUploaded', 'caseFile', 'referees',
          'experience', 'education', 'certificates', 'documentsUploaded'
        ]
      }
    }
  }
};
const CompanyTCOptions = {
  fields:{
    remove: [
      'password', 'passwordVersion','createdAt', 'createdBy', 'updatedAt',
       'updatedBy'
    ]
  },
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'jobs', 'cacRegNo', 'password', 'passwordVersion',
          'isVerified', 'isActive'
        ]
      }
    }
  }
};

/**
* Exports
*/
const UserTC = exports.UserTC = composeWithMongoose(User, UserTCOptions);
const PollTC = exports.PollTC = composeWithMongoose(Poll);
const PollVoteTC = exports.PollVoteTC = composeWithMongoose(PollVote);
const LocalGovernmentTC = exports.LocalGovernmentTC = composeWithMongoose(LocalGovernment);
const StateTC = exports.StateTC = composeWithMongoose(State);
const JobExperienceTC = exports.JobExperienceTC = composeWithMongoose(JobExperience);
const EducationTC = exports.EducationTC = composeWithMongoose(Education);
const CertificateTC = exports.CertificateTC = composeWithMongoose(Certificate);
const RefereeTC = exports.RefereeTC = composeWithMongoose(Referee);
const CandidateTC = exports.CandidateTC = composeWithMongoose(Candidate, CandidateTCOptions);
const CandidateDocumentTC = exports.CandidateDocumentTC = composeWithMongoose(CandidateDocument);
const CenterManagerTC = exports.CenterManagerTC = composeWithMongoose(CenterManager, CenterManagerTCOptions);
const CompanyTC = exports.CompanyTC = composeWithMongoose(Company, CompanyTCOptions);
const CompanyMessageTC = exports.CompanyMessageTC = composeWithMongoose(CompanyMessage);
const IndustryTC = exports.IndustryTC = composeWithMongoose(Industry);
const JobTC = exports.JobTC = composeWithMongoose(Job);
const CaseFileTC = exports.CaseFileTC = composeWithMongoose(CaseFile);

/**
* Add JWT to user models for login
*/
UserTC.addFields({jwt: 'String', id: 'String'})
CandidateTC.addFields({jwt: 'String', id: 'String'})
/*CandidateDocumentTC.getITC().addFields({
  id: {type: 'String'},
  file: `type ComplexType {
    subField1: String
    subField2: Float
    subField3: Boolean
    subField4: ID
    subField5: JSON
    subField6: Date
  }`
})*/

// const FileTC = TypeComposer.create({
//   name: 'File',
//   fields: {
//     id: 'Int!',
//     firstName: 'String',
//     lastName: 'String',
//   }
// });*/
// CandidateDocumentTC.getInputTypeComposer().addFields({
//   file: TypeComposer.create(`
//     type Author {
//       id: Int!
//       firstName: String
//       lastName: String
//     }
//   `)
// })
CompanyTC.addFields({jwt: 'String'})
CenterManagerTC.addFields({jwt: 'String'})


/**
* Viewer Fields for authentication and authorization
*/
const ViewerCandidateTC = exports.ViewerCandidateTC = GQC.getOrCreateTC('ViewerCandidate');
const ViewerCompanyTC = exports.ViewerCompanyTC = GQC.getOrCreateTC('ViewerCompany');
const ViewerCenterManagerTC = exports.ViewerCenterManagerTC = GQC.getOrCreateTC('ViewerCenterManager');
