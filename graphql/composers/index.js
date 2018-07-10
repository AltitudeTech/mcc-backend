const { composeWithMongoose } = require('graphql-compose-mongoose');
const keystone = require('keystone');
const { GQC } = require('graphql-compose');

/**
* Mongoose Models
*/
const User = keystone.list('User').model;
const LocalGovernment = keystone.list('LocalGovernment').model;
const State = keystone.list('State').model;
const Candidate = keystone.list('Candidate').model;
const MccAffiliate = keystone.list('MccAffiliate').model;
const MccCoupon = keystone.list('MccCoupon').model;
const Admin = keystone.list('Admin').model;
const Institution = keystone.list('Institution').model;
const InstitutionMessage = keystone.list('InstitutionMessage').model;
const Industry = keystone.list('Industry').model;
const Payment = keystone.list('Payment').model;
const Price = keystone.list('Price').model;
const TestCode = keystone.list('TestCode').model;
const Notification = keystone.list('Notification').model;
const NotificationReadReceipt = keystone.list('NotificationReadReceipt').model;

const GuestEnquiry = keystone.list('GuestEnquiry').model;
// const Newsletter = keystone.list('Newsletter').model;

/**
* Config
*/
const privateUserFields = [
  'password', 'passwordVersion','isAdmin'
]

const UserTCOptions = {
  fields : {
    remove: ['password', 'passwordVersion','isAdmin']
  },
  resolvers : {
    updateById: {
      record: {
        removeFields: [
          'phone', 'password','passwordVersion'
        ]
      }
    }
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
          'phone', 'password','passwordVersion','isActivated'
        ]
      }
    }
  }
};
const MccAffiliateTCOptions = {
  fields:{
    remove: [
      'password', 'passwordVersion'
     ]
  },
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'phone', 'password','passwordVersion','isActivated'
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
          'phone', 'password', 'passwordVersion'
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
          'isVerified', 'isActive', 'phone', 'isActivated'
        ]
      }
    }
  }
};
const PaymentTCOptions = {
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'madeBy', 'paystackReference'
        ]
      }
    }
  }
};
const GuestEnquiryTCOptions = {
  resolvers:{
    createOne: {
      record: {
        removeFields: [
          'createdAt', '_id', 'unsubcribeCode', 'isActive'
        ]
      }
    }
  }
};
const NSTCOpts = [ '_id', 'createdAt', 'isActive', 'unsubcribeCode' ]
const NewsletterSubscriberTCTCOptions = {
  fields:{
    remove: NSTCOpts
  },
  resolvers:{
    createOne: {
      record: {
        removeFields: NSTCOpts
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
const MccAffiliateTC = exports.MccAffiliateTC = composeWithMongoose(MccAffiliate, MccAffiliateTCOptions);
const MccCouponTC = exports.MccCouponTC = composeWithMongoose(MccCoupon);
const AdminTC = exports.AdminTC = composeWithMongoose(Admin, AdminTCOptions);
const InstitutionTC = exports.InstitutionTC = composeWithMongoose(Institution, InstitutionTCOptions);
const InstitutionMessageTC = exports.InstitutionMessageTC = composeWithMongoose(InstitutionMessage);
const PaymentTC = exports.PaymentTC = composeWithMongoose(Payment, PaymentTCOptions);
const PriceTC = exports.PriceTC = composeWithMongoose(Price);
const TestCodeTC = exports.TestCodeTC = composeWithMongoose(TestCode);
const GuestEnquiryTC = exports.GuestEnquiryTC = composeWithMongoose(GuestEnquiry, GuestEnquiryTCOptions);
const NotificationTC = exports.NotificationTC = composeWithMongoose(Notification);
const NotificationReadReceiptTC = exports.NotificationReadReceiptTC = composeWithMongoose(NotificationReadReceipt);

/**
* Add JWT to user models for login
*/
UserTC.addFields({jwt: 'String', userType: 'String'})
CandidateTC.addFields({jwt: 'String'})
InstitutionTC.addFields({jwt: 'String'})
AdminTC.addFields({jwt: 'String'})
MccAffiliateTC.addFields({jwt: 'String'})
// NotificationTC.addFields({isRead: 'Boolean'})

/**
* Viewer Fields for authentication and authorization
*/
const ViewerCandidateTC = exports.ViewerCandidateTC = GQC.getOrCreateTC('ViewerCandidate');
const ViewerInstitutionTC = exports.ViewerInstitutionTC = GQC.getOrCreateTC('ViewerInstitution');
const ViewerAdminTC = exports.ViewerAdminTC = GQC.getOrCreateTC('ViewerAdmin');
const ViewerMccAffiliateTC = exports.ViewerMccAffiliateTC = GQC.getOrCreateTC('ViewerMccAffiliate');

const NewsletterSubscriberTC = exports.NewsletterSubscriberTC = GQC.getOrCreateTC('NewsletterSubscriber');
NewsletterSubscriberTC.addFields({address: 'String', subscribed: 'Boolean', name: 'String'})

const PlaceHolderTC = exports.PlaceHolderTC = GQC.getOrCreateTC('PlaceHolder');
