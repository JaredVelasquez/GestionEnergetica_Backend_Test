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
import {TipoCargoFacturaManual} from '../models';
import {TipoCargoFacturaManualRepository} from '../repositories';

export class TipoCargoFacturaManualController {
  constructor(
    @repository(TipoCargoFacturaManualRepository)
    public tipoCargoFacturaManualRepository : TipoCargoFacturaManualRepository,
  ) {}

  @post('/tipo-cargo-factura-manuals')
  @response(200, {
    description: 'TipoCargoFacturaManual model instance',
    content: {'application/json': {schema: getModelSchemaRef(TipoCargoFacturaManual)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoCargoFacturaManual, {
            title: 'NewTipoCargoFacturaManual',
            exclude: ['id'],
          }),
        },
      },
    })
    tipoCargoFacturaManual: Omit<TipoCargoFacturaManual, 'id'>,
  ): Promise<TipoCargoFacturaManual> {
    return this.tipoCargoFacturaManualRepository.create(tipoCargoFacturaManual);
  }

  @get('/tipo-cargo-factura-manuals/count')
  @response(200, {
    description: 'TipoCargoFacturaManual model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TipoCargoFacturaManual) where?: Where<TipoCargoFacturaManual>,
  ): Promise<Count> {
    return this.tipoCargoFacturaManualRepository.count(where);
  }

  @get('/tipo-cargo-factura-manuals')
  @response(200, {
    description: 'Array of TipoCargoFacturaManual model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoCargoFacturaManual, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TipoCargoFacturaManual) filter?: Filter<TipoCargoFacturaManual>,
  ): Promise<TipoCargoFacturaManual[]> {
    return this.tipoCargoFacturaManualRepository.find(filter);
  }

  @patch('/tipo-cargo-factura-manuals')
  @response(200, {
    description: 'TipoCargoFacturaManual PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoCargoFacturaManual, {partial: true}),
        },
      },
    })
    tipoCargoFacturaManual: TipoCargoFacturaManual,
    @param.where(TipoCargoFacturaManual) where?: Where<TipoCargoFacturaManual>,
  ): Promise<Count> {
    return this.tipoCargoFacturaManualRepository.updateAll(tipoCargoFacturaManual, where);
  }

  @get('/tipo-cargo-factura-manuals/{id}')
  @response(200, {
    description: 'TipoCargoFacturaManual model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoCargoFacturaManual, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TipoCargoFacturaManual, {exclude: 'where'}) filter?: FilterExcludingWhere<TipoCargoFacturaManual>
  ): Promise<TipoCargoFacturaManual> {
    return this.tipoCargoFacturaManualRepository.findById(id, filter);
  }

  @patch('/tipo-cargo-factura-manuals/{id}')
  @response(204, {
    description: 'TipoCargoFacturaManual PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoCargoFacturaManual, {partial: true}),
        },
      },
    })
    tipoCargoFacturaManual: TipoCargoFacturaManual,
  ): Promise<void> {
    await this.tipoCargoFacturaManualRepository.updateById(id, tipoCargoFacturaManual);
  }

  @put('/tipo-cargo-factura-manuals/{id}')
  @response(204, {
    description: 'TipoCargoFacturaManual PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tipoCargoFacturaManual: TipoCargoFacturaManual,
  ): Promise<void> {
    await this.tipoCargoFacturaManualRepository.replaceById(id, tipoCargoFacturaManual);
  }

  @del('/tipo-cargo-factura-manuals/{id}')
  @response(204, {
    description: 'TipoCargoFacturaManual DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tipoCargoFacturaManualRepository.deleteById(id);
  }
}
