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
import {PuntoMedicion} from '../models';
import {PuntoMedicionRepository} from '../repositories';

@authenticate('admin', 'owner')
export class MeasuringPointController {
  constructor(
    @repository(PuntoMedicionRepository)
    public puntoMedicionRepository: PuntoMedicionRepository,
  ) { }

  @post('/punto-medicions')
  @response(200, {
    description: 'PuntoMedicion model instance',
    content: {'application/json': {schema: getModelSchemaRef(PuntoMedicion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PuntoMedicion, {
            title: 'NewPuntoMedicion',
            exclude: ['id'],
          }),
        },
      },
    })
    puntoMedicion: Omit<PuntoMedicion, 'id'>,
  ): Promise<PuntoMedicion> {
    return this.puntoMedicionRepository.create(puntoMedicion);
  }

  @get('/punto-medicions/count')
  @response(200, {
    description: 'PuntoMedicion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PuntoMedicion) where?: Where<PuntoMedicion>,
  ): Promise<Count> {
    return this.puntoMedicionRepository.count(where);
  }

  @get('/punto-medicions')
  @response(200, {
    description: 'Array of PuntoMedicion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PuntoMedicion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PuntoMedicion) filter?: Filter<PuntoMedicion>,
  ): Promise<PuntoMedicion[]> {
    return this.puntoMedicionRepository.find(filter);
  }

  @patch('/punto-medicions')
  @response(200, {
    description: 'PuntoMedicion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PuntoMedicion, {partial: true}),
        },
      },
    })
    puntoMedicion: PuntoMedicion,
    @param.where(PuntoMedicion) where?: Where<PuntoMedicion>,
  ): Promise<Count> {
    return this.puntoMedicionRepository.updateAll(puntoMedicion, where);
  }

  @get('/punto-medicions/{id}')
  @response(200, {
    description: 'PuntoMedicion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PuntoMedicion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PuntoMedicion, {exclude: 'where'}) filter?: FilterExcludingWhere<PuntoMedicion>
  ): Promise<PuntoMedicion> {
    return this.puntoMedicionRepository.findById(id, filter);
  }

  @patch('/punto-medicions/{id}')
  @response(204, {
    description: 'PuntoMedicion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PuntoMedicion, {partial: true}),
        },
      },
    })
    puntoMedicion: PuntoMedicion,
  ): Promise<void> {
    await this.puntoMedicionRepository.updateById(id, puntoMedicion);
  }

  @put('/punto-medicions/{id}')
  @response(204, {
    description: 'PuntoMedicion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() puntoMedicion: PuntoMedicion,
  ): Promise<void> {
    await this.puntoMedicionRepository.replaceById(id, puntoMedicion);
  }

  @del('/punto-medicions/{id}')
  @response(204, {
    description: 'PuntoMedicion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.puntoMedicionRepository.deleteById(id);
  }
}
