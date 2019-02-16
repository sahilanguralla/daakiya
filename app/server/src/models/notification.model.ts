import {Entity, model, property} from '@loopback/repository';

@model({settings: {"strict":false}})
export class Notification extends Entity {
  @property({
    id: true,
    type: 'string'
  })
  id?: string;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  message?: string;

  @property({
    type: 'string',
  })
  packageName?: string;

  @property({
    type: 'string',
  })
  notificationId?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<Notification>) {
    super(data);
  }
}
