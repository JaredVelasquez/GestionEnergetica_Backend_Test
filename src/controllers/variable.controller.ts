import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Variables} from '../models';
import {VariablesRepository} from '../repositories';

export class VariableController {
  constructor(
    @repository(VariablesRepository)
    public variablesRepository : VariablesRepository,
  ) {}

  @post('/variables')
  @response(200, {
    description: 'Variables model instance',
    content: {'application/json': {schema: getModelSchemaRef(Variables)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Variables, {
            title: 'NewVariables',
            exclude: ['id'],
          }),
        },
      },
    })
    variables: Omit<Variables, 'id'>,
  ): Promise<Variables> {
    return this.variablesRepository.create(variables);
  }

  @get('/variables/count')
  @response(200, {
    description: 'Variables model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Variables) where?: Where<Variables>,
  ): Promise<Count> {
    return this.variablesRepository.count(where);
  }

  @get('/variables')
  @response(200, {
    description: 'Array of Variables model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Variables, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Variables) filter?: Filter<Variables>,
  ): Promise<Variables[]> {
    return this.variablesRepository.find(filter);
  }

  @patch('/variables')
  @response(200, {
    description: 'Variables PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Variables, {partial: true}),
        },
      },
    })
    variables: Variables,
    @param.where(Variables) where?: Where<Variables>,
  ): Promise<Count> {
    return this.variablesRepository.updateAll(variables, where);
  }

  @get('/variables/{id}')
  @response(200, {
    description: 'Variables model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Variables, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Variables, {exclude: 'where'}) filter?: FilterExcludingWhere<Variables>
  ): Promise<Variables> {
    return this.variablesRepository.findById(id, filter);
  }

  @patch('/variables/{id}')
  @response(204, {
    description: 'Variables PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Variables, {partial: true}),
        },
      },
    })
    variables: Variables,
  ): Promise<void> {
    await this.variablesRepository.updateById(id, variables);
  }

  @put('/variables/{id}')
  @response(204, {
    description: 'Variables PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() variables: Variables,
  ): Promise<void> {
    await this.variablesRepository.replaceById(id, variables);
  }

  @del('/variables/{id}')
  @response(204, {
    description: 'Variables DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.variablesRepository.deleteById(id);
  }
}
