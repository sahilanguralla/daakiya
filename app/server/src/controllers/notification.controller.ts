import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Notification} from '../models';
import {NotificationRepository} from '../repositories';

export class NotificationController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository : NotificationRepository,
  ) {}

  @post('/notifications', {
    responses: {
      '200': {
        description: 'Notification model instance',
        content: {'application/json': {schema: {'x-ts-type': Notification}}},
      },
    },
  })
  async create(@requestBody() notification: Notification): Promise<Notification> {
    return await this.notificationRepository.create(notification);
  }

  @get('/notifications/count', {
    responses: {
      '200': {
        description: 'Notification model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Notification)) where?: Where,
  ): Promise<Count> {
    return await this.notificationRepository.count(where);
  }

  @get('/notifications', {
    responses: {
      '200': {
        description: 'Array of Notification model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Notification}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Notification)) filter?: Filter,
  ): Promise<Notification[]> {
    return await this.notificationRepository.find(filter);
  }

  @patch('/notifications', {
    responses: {
      '200': {
        description: 'Notification PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() notification: Notification,
    @param.query.object('where', getWhereSchemaFor(Notification)) where?: Where,
  ): Promise<Count> {
    return await this.notificationRepository.updateAll(notification, where);
  }

  @get('/notifications/{id}', {
    responses: {
      '200': {
        description: 'Notification model instance',
        content: {'application/json': {schema: {'x-ts-type': Notification}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Notification> {
    return await this.notificationRepository.findById(id);
  }

  @patch('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notification PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() notification: Notification,
  ): Promise<void> {
    await this.notificationRepository.updateById(id, notification);
  }

  @put('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notification PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() notification: Notification,
  ): Promise<void> {
    await this.notificationRepository.replaceById(id, notification);
  }

  @del('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notification DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.notificationRepository.deleteById(id);
  }
}
