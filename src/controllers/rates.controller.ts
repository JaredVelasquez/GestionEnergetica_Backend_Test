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
import {Tarifa} from '../models';
import {TarifaParametroDetalleRepository, TarifaRepository} from '../repositories';

export class RatesController {
  constructor(
    @repository(TarifaRepository)
    public tarifaRepository: TarifaRepository,
    @repository(TarifaParametroDetalleRepository)
    public tarifaParametroDetalleRepository: TarifaParametroDetalleRepository,
  ) { }

  @post('/tarifas')
  @response(200, {
    description: 'Tarifa model instance',
    content: {'application/json': {schema: getModelSchemaRef(Tarifa)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tarifa, {
            title: 'NewTarifa',
            exclude: ['id'],
          }),
        },
      },
    })
    tarifa: Omit<Tarifa, 'id'>,
  ): Promise<Tarifa> {
    return this.tarifaRepository.create(tarifa);
  }

  @get('/tarifas/count')
  @response(200, {
    description: 'Tarifa model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Tarifa) where?: Where<Tarifa>,
  ): Promise<Count> {
    return this.tarifaRepository.count(where);
  }

  @get('/tarifas')
  @response(200, {
    description: 'Array of Tarifa model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tarifa, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Tarifa) filter?: Filter<Tarifa>,
  ): Promise<Tarifa[]> {
    return this.tarifaRepository.find(filter);
  }

  @patch('/tarifas')
  @response(200, {
    description: 'Tarifa PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tarifa, {partial: true}),
        },
      },
    })
    tarifa: Tarifa,
    @param.where(Tarifa) where?: Where<Tarifa>,
  ): Promise<Count> {
    return this.tarifaRepository.updateAll(tarifa, where);
  }

  @get('/tarifas/{id}')
  @response(200, {
    description: 'Tarifa model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Tarifa, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Tarifa, {exclude: 'where'}) filter?: FilterExcludingWhere<Tarifa>
  ): Promise<Tarifa> {
    return this.tarifaRepository.findById(id, filter);
  }

  @patch('/tarifas/{id}')
  @response(204, {
    description: 'Tarifa PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tarifa, {partial: true}),
        },
      },
    })
    tarifa: Tarifa,
  ): Promise<void> {
    await this.tarifaRepository.updateById(id, tarifa);
  }

  @put('/tarifas/{id}')
  @response(204, {
    description: 'Tarifa PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tarifa: Tarifa,
  ): Promise<void> {
    await this.tarifaRepository.replaceById(id, tarifa);
  }

  @del('/tarifas/{id}')
  @response(204, {
    description: 'Tarifa DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    let existRelation = await this.tarifaParametroDetalleRepository.find({where: {tarifaId: id}});
    if (existRelation) {
      for (let i = 0; i < existRelation.length; i++) {
        await this.tarifaParametroDetalleRepository.deleteById(existRelation[i].id);
      }
    }

    await this.tarifaRepository.deleteById(id);
  }

  @get('/get-rates/{id}')
  async getRates(
    @param.path.number('id') id: number
  ): Promise<any> {
    let datos = await this.dataRates(id);
    return datos;
  }

  async dataRates(id: number) {

    return await this.tarifaRepository.dataSource.execute(
      `${viewOf.GET_RATES} Where estado = ${id}`,
    );
  }
}
