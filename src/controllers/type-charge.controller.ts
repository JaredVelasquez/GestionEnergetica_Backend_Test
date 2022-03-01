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
import {TipoCargo} from '../models';
import {TipoCargoRepository} from '../repositories';

export class TypeChargeController {
  constructor(
    @repository(TipoCargoRepository)
    public tipoCargoRepository : TipoCargoRepository,
  ) {}

  @post('/tipo-cargos')
  @response(200, {
    description: 'TipoCargo model instance',
    content: {'application/json': {schema: getModelSchemaRef(TipoCargo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoCargo, {
            title: 'NewTipoCargo',
            exclude: ['id'],
          }),
        },
      },
    })
    tipoCargo: Omit<TipoCargo, 'id'>,
  ): Promise<TipoCargo> {
    return this.tipoCargoRepository.create(tipoCargo);
  }

  @get('/tipo-cargos/count')
  @response(200, {
    description: 'TipoCargo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TipoCargo) where?: Where<TipoCargo>,
  ): Promise<Count> {
    return this.tipoCargoRepository.count(where);
  }

  @get('/tipo-cargos')
  @response(200, {
    description: 'Array of TipoCargo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoCargo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TipoCargo) filter?: Filter<TipoCargo>,
  ): Promise<TipoCargo[]> {
    return this.tipoCargoRepository.find(filter);
  }

  @patch('/tipo-cargos')
  @response(200, {
    description: 'TipoCargo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoCargo, {partial: true}),
        },
      },
    })
    tipoCargo: TipoCargo,
    @param.where(TipoCargo) where?: Where<TipoCargo>,
  ): Promise<Count> {
    return this.tipoCargoRepository.updateAll(tipoCargo, where);
  }

  @get('/tipo-cargos/{id}')
  @response(200, {
    description: 'TipoCargo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoCargo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TipoCargo, {exclude: 'where'}) filter?: FilterExcludingWhere<TipoCargo>
  ): Promise<TipoCargo> {
    return this.tipoCargoRepository.findById(id, filter);
  }

  @patch('/tipo-cargos/{id}')
  @response(204, {
    description: 'TipoCargo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoCargo, {partial: true}),
        },
      },
    })
    tipoCargo: TipoCargo,
  ): Promise<void> {
    await this.tipoCargoRepository.updateById(id, tipoCargo);
  }

  @put('/tipo-cargos/{id}')
  @response(204, {
    description: 'TipoCargo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tipoCargo: TipoCargo,
  ): Promise<void> {
    await this.tipoCargoRepository.replaceById(id, tipoCargo);
  }

  @del('/tipo-cargos/{id}')
  @response(204, {
    description: 'TipoCargo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tipoCargoRepository.deleteById(id);
  }
}
