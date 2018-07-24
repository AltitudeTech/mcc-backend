const keystone = require('keystone');
const { MccAffiliateTC } = require('../../composers');
const jwt = require('jsonwebtoken');
const MccAffiliate = keystone.list('MccAffiliate').model;
const User = keystone.list('User').model;
const { InputTypeComposer } = require('graphql-compose')

InputTypeComposer.create({
  name: 'createAffiliateAccountInput',
  type: 'input',
  fields: {
    name: 'String!',
    phone: 'String!',
    email: 'String!',
    password: 'String!',
    workAddress: 'String',
    physicalAddress: 'String!',
    referee1name: 'String!',
    referee1phone: 'String!',
    referee2name: 'String!',
    referee2phone: 'String!'
  }
});

module.exports = {
  kind: 'mutation',
  name: 'createAccount',
  description: 'create an affiliate account',
  args: { input: 'createAffiliateAccountInput!' },
  type: MccAffiliateTC,
  resolve: async ({ args: {input}, context }) => {
    const {
      name,
      phone,
      email,
      password,
      workAddress,
      physicalAddress,
      referee1name,
      referee1phone,
      referee2name,
      referee2phone
    } = input;
    return User.findOne({email}).then((existing) => {
      if (!existing) {
        // hash password and create user
        const newMccAffiliate = new MccAffiliate({
          name,
          phone,
          email,
          password,
          workAddress,
          physicalAddress,
          referee1name,
          referee1phone,
          referee2name,
          referee2phone
        })
        return newMccAffiliate.save().then((affiliate)=>{
          const { id, email } = affiliate;
          const token = jwt.sign({
            id: affiliate._id,
            // email: affiliate.email,
            type: 'MccAffiliate',
            //passwordVersion: affiliate.passwordVersion,
          }, process.env.JWT_SECRET);
          return {
            name: affiliate.name,
            jwt: token,
          };
        }).catch((err) => {
          return Promise.reject('Cannot create record, Please try again');
        })
      }
      return Promise.reject('Email already exists');
    })
  }
};
