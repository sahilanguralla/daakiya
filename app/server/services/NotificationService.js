var Notification = require('electron').Notification;

class NotificationService {
  static showNotification(options) {
    var notification = new Notification(options);
    notification.show();
  }
}

module.exports = NotificationService;
