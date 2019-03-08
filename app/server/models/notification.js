'use strict';
var NotificationService = require('../services/NotificationService.js');

module.exports = function(Notification) {
  Notification.on('dataSourceAttached', function(obj) {
    var create = Notification.create;
    Notification.create = function(notification, cb) {
      NotificationService.showNotification({
        title: notification.title,
        subtitle: notification.packageName,
        body: notification.message,
      });
      return create.apply(this, arguments);
    };
  });
};
