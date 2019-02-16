import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './sqlite.datasource.json';

export class SqliteDataSource extends juggler.DataSource {
  static dataSourceName = 'sqlite';

  constructor(
    @inject('datasources.config.sqlite', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
