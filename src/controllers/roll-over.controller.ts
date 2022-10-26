import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {RollOver} from '../models';
import {RollOverRepository} from '../repositories';

@authenticate('admin', 'owner')
export class RollOverController {
  constructor(
    @repository(RollOverRepository)
    public rollOverRepository: RollOverRepository,
  ) { }

  @post('/roll-overs')
  @response(200, {
    description: 'RollOver model instance',
    content: {'application/json': {schema: getModelSchemaRef(RollOver)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RollOver, {
            title: 'NewRollOver',
            exclude: ['id'],
          }),
        },
      },
    })
    rollOver: Omit<RollOver, 'id'>,
  ): Promise<RollOver> {
    return this.rollOverRepository.create(rollOver);
  }

  @get('/roll-overs/count')
  @response(200, {
    description: 'RollOver model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RollOver) where?: Where<RollOver>,
  ): Promise<Count> {
    return this.rollOverRepository.count(where);
  }

  @get('/roll-overs')
  @response(200, {
    description: 'Array of RollOver model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RollOver, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RollOver) filter?: Filter<RollOver>,
  ): Promise<RollOver[]> {
    return this.rollOverRepository.find(filter);
  }

  @patch('/roll-overs')
  @response(200, {
    description: 'RollOver PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RollOver, {partial: true}),
        },
      },
    })
    rollOver: RollOver,
    @param.where(RollOver) where?: Where<RollOver>,
  ): Promise<Count> {
    return this.rollOverRepository.updateAll(rollOver, where);
  }

  @get('/roll-overs/{id}')
  @response(200, {
    description: 'RollOver model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RollOver, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RollOver, {exclude: 'where'}) filter?: FilterExcludingWhere<RollOver>
  ): Promise<RollOver> {
    return this.rollOverRepository.findById(id, filter);
  }

  @patch('/roll-overs/{id}')
  @response(204, {
    description: 'RollOver PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RollOver, {partial: true}),
        },
      },
    })
    rollOver: RollOver,
  ): Promise<void> {
    await this.rollOverRepository.updateById(id, rollOver);
  }

  @put('/roll-overs/{id}')
  @response(204, {
    description: 'RollOver PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() rollOver: RollOver,
  ): Promise<void> {
    await this.rollOverRepository.replaceById(id, rollOver);
  }

  @del('/roll-overs/{id}')
  @response(204, {
    description: 'RollOver DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.rollOverRepository.deleteById(id);
  }
}
