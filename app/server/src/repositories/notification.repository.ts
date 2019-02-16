import {DefaultCrudRepository} from '@loopback/repository';
import {Notification} from '../models';
import {SqliteDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class NotificationRepository extends DefaultCrudRepository<
  Notification,
  typeof Notification.prototype.id
> {
  constructor(
    @inject('datasources.sqlite') dataSource: SqliteDataSource,
  ) {
    super(Notification, dataSource);
  }
}
