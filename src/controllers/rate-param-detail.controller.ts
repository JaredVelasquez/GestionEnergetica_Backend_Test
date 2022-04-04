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
import {viewOf} from '../core/library/views.library';
import {TarifaParametroDetalle} from '../models';
import {TarifaParametroDetalleRepository} from '../repositories';

export class RateParamDetailController {
  constructor(
    @repository(TarifaParametroDetalleRepository)
    public tarifaParametroDetalleRepository: TarifaParametroDetalleRepository,

  ) { }

  @post('/tarifa-parametro-detalles')
  @response(200, {
    description: 'TarifaParametroDetalle model instance',
    content: {'application/json': {schema: getModelSchemaRef(TarifaParametroDetalle)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TarifaParametroDetalle, {
            title: 'NewTarifaParametroDetalle',
            exclude: ['id'],
          }),
        },
      },
    })
    tarifaParametroDetalle: Omit<TarifaParametroDetalle, 'id'>,
  ): Promise<TarifaParametroDetalle> {
    return this.tarifaParametroDetalleRepository.create(tarifaParametroDetalle);
  }

  @get('/tarifa-parametro-detalles/count')
  @response(200, {
    description: 'TarifaParametroDetalle model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TarifaParametroDetalle) where?: Where<TarifaParametroDetalle>,
  ): Promise<Count> {
    return this.tarifaParametroDetalleRepository.count(where);
  }

  @get('/tarifa-parametro-detalles')
  @response(200, {
    description: 'Array of TarifaParametroDetalle model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TarifaParametroDetalle, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TarifaParametroDetalle) filter?: Filter<TarifaParametroDetalle>,
  ): Promise<TarifaParametroDetalle[]> {
    return this.tarifaParametroDetalleRepository.find(filter);
  }

  @patch('/tarifa-parametro-detalles')
  @response(200, {
    description: 'TarifaParametroDetalle PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TarifaParametroDetalle, {partial: true}),
        },
      },
    })
    tarifaParametroDetalle: TarifaParametroDetalle,
    @param.where(TarifaParametroDetalle) where?: Where<TarifaParametroDetalle>,
  ): Promise<Count> {
    return this.tarifaParametroDetalleRepository.updateAll(tarifaParametroDetalle, where);
  }

  @get('/tarifa-parametro-detalles/{id}')
  @response(200, {
    description: 'TarifaParametroDetalle model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TarifaParametroDetalle, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TarifaParametroDetalle, {exclude: 'where'}) filter?: FilterExcludingWhere<TarifaParametroDetalle>
  ): Promise<TarifaParametroDetalle> {
    return this.tarifaParametroDetalleRepository.findById(id, filter);
  }

  @patch('/tarifa-parametro-detalles/{id}')
  @response(204, {
    description: 'TarifaParametroDetalle PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TarifaParametroDetalle, {partial: true}),
        },
      },
    })
    tarifaParametroDetalle: TarifaParametroDetalle,
  ): Promise<void> {
    await this.tarifaParametroDetalleRepository.updateById(id, tarifaParametroDetalle);
  }

  @put('/tarifa-parametro-detalles/{id}')
  @response(204, {
    description: 'TarifaParametroDetalle PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tarifaParametroDetalle: TarifaParametroDetalle,
  ): Promise<void> {
    await this.tarifaParametroDetalleRepository.replaceById(id, tarifaParametroDetalle);
  }

  @del('/tarifa-parametro-detalles/{id}')
  @response(204, {
    description: 'TarifaParametroDetalle DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tarifaParametroDetalleRepository.deleteById(id);
  }


  @get('/get-pt-detail/{id}')
  async ParamtersTable(
    @param.path.number('id') id: number
  ): Promise<any> {
    let datos = await this.getTPdetail(id);
    return datos;
  }

  async getTPdetail(id: number) {

    return await this.tarifaParametroDetalleRepository.dataSource.execute(
      `${viewOf.GET_PT_DETAIL} Where estado = ${id}`,
    );
  }
}
