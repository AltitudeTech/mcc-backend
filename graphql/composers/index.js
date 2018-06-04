const { composeWithMongoose } = require('graphql-compose-mongoose');
const keystone = require('keystone');
const { GQC, TypeComposer, InputTypeComposer  } = require('graphql-compose');

/**
* Mongoose Models
*/
const User = keystone.list('User').model;
const LocalGovernment = keystone.list('LocalGovernment').model;
const State = keystone.list('State').model;
const Candidate = keystone.list('Candidate').model;
const Admin = keystone.list('Admin').model;
const Institution = keystone.list('Institution').model;
const InstitutionMessage = keystone.list('InstitutionMessage').model;
const Industry = keystone.list('Industry').model;

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
      'password', 'passwordVersion'
     ]
  },
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'phone', 'result', 'category', 'password',
          'passwordVersion'
        ]
      }
    }
  }
};
const AdminTCOptions = {
  fields:{
    remove: [
      'password', 'passwordVersion'
     ]
  },
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'phone', 'result', 'category', 'password',
          'passwordVersion'
        ]
      }
    }
  }
};
const InstitutionTCOptions = {
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
const LocalGovernmentTC = exports.LocalGovernmentTC = composeWithMongoose(LocalGovernment);
const StateTC = exports.StateTC = composeWithMongoose(State);
const CandidateTC = exports.CandidateTC = composeWithMongoose(Candidate, CandidateTCOptions);
const AdminTC = exports.AdminTC = composeWithMongoose(Admin, AdminTCOptions);
const InstitutionTC = exports.InstitutionTC = composeWithMongoose(Institution, InstitutionTCOptions);
const InstitutionMessageTC = exports.InstitutionMessageTC = composeWithMongoose(InstitutionMessage);


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
InstitutionTC.addFields({jwt: 'String'})
AdminTC.addFields({jwt: 'String'})


/**
* Viewer Fields for authentication and authorization
*/
const ViewerCandidateTC = exports.ViewerCandidateTC = GQC.getOrCreateTC('ViewerCandidate');
const ViewerInstitutionTC = exports.ViewerInstitutionTC = GQC.getOrCreateTC('ViewerInstitution');
const ViewerAdminTC = exports.ViewerAdminTC = GQC.getOrCreateTC('ViewerAdmin');
