const keystone = require('keystone');
const { NotificationTC } = require('../../composers');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Notification = keystone.list('Notification').model;
const NotificationReadReceipt = keystone.list('NotificationReadReceipt').model;

module.exports = {
  kind: 'query',
  name: 'userNotifications',
  description: 'returns all notifications associated with user',
  args: {
    filter: `
      input NotificationFilterInput {
        userId: String!
        userCreatedAt: Date!
      }
    `
  },
  type: [NotificationTC.addFields({isRead: 'Boolean'})],
  resolve: async ({ args, context }) => {
    const { filter : {userId, userCreatedAt} } = args;
    try {
      const notifications = await Notification.find({$or: [
        {
          receiversType: 'ALL_PAST_AND_FUTURE_USERS'
        },
        {
          $and: [ {receiversType: 'ALL_EXISTING_USERS_AT_CREATION'}, {createdAt: {$gte: userCreatedAt}} ]
        },
        {
          $and: [ {receiversType: 'ALL_EXISTING_USERS_AFTER_CREATION'}, {createdAt: {$lte: userCreatedAt}} ]
        },
        {
          $and: [ {receiversType: 'CUSTOM'}, {receivers: {$in: [userId]}} ]
        },
      ]});

      const readReceipts = await NotificationReadReceipt.find({
        user: userId
      })

      return notifications.map(notification=>{
        notification.isRead = readReceipts.find(receipt => (receipt.notification == notification.id)) ? true : false;
        return (notification);
      });
    } catch (e) {
      throw e;
    }
  }
}
