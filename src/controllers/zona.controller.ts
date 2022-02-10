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
import {Zona} from '../models';
import {ZonaRepository} from '../repositories';

export class ZonaController {
  constructor(
    @repository(ZonaRepository)
    public zonaRepository : ZonaRepository,
  ) {}

  @post('/zonas')
  @response(200, {
    description: 'Zona model instance',
    content: {'application/json': {schema: getModelSchemaRef(Zona)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Zona, {
            title: 'NewZona',
            exclude: ['id'],
          }),
        },
      },
    })
    zona: Omit<Zona, 'id'>,
  ): Promise<Zona> {
    return this.zonaRepository.create(zona);
  }

  @get('/zonas/count')
  @response(200, {
    description: 'Zona model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Zona) where?: Where<Zona>,
  ): Promise<Count> {
    return this.zonaRepository.count(where);
  }

  @get('/zonas')
  @response(200, {
    description: 'Array of Zona model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Zona, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Zona) filter?: Filter<Zona>,
  ): Promise<Zona[]> {
    return this.zonaRepository.find(filter);
  }

  @patch('/zonas')
  @response(200, {
    description: 'Zona PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Zona, {partial: true}),
        },
      },
    })
    zona: Zona,
    @param.where(Zona) where?: Where<Zona>,
  ): Promise<Count> {
    return this.zonaRepository.updateAll(zona, where);
  }

  @get('/zonas/{id}')
  @response(200, {
    description: 'Zona model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Zona, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Zona, {exclude: 'where'}) filter?: FilterExcludingWhere<Zona>
  ): Promise<Zona> {
    return this.zonaRepository.findById(id, filter);
  }

  @patch('/zonas/{id}')
  @response(204, {
    description: 'Zona PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Zona, {partial: true}),
        },
      },
    })
    zona: Zona,
  ): Promise<void> {
    await this.zonaRepository.updateById(id, zona);
  }

  @put('/zonas/{id}')
  @response(204, {
    description: 'Zona PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() zona: Zona,
  ): Promise<void> {
    await this.zonaRepository.replaceById(id, zona);
  }

  @del('/zonas/{id}')
  @response(204, {
    description: 'Zona DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.zonaRepository.deleteById(id);
  }
}
