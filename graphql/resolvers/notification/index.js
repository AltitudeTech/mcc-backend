const { NotificationTC } = require('../../composers');

module.exports = () => {

  NotificationTC.addResolver(require('./userNotifications'))

}
