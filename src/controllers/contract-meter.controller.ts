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
import {ContratosMedidores} from '../models';
import {ContratosMedidoresRepository} from '../repositories';

export class ContractMeterController {
  constructor(
    @repository(ContratosMedidoresRepository)
    public contratosMedidoresRepository: ContratosMedidoresRepository,
  ) { }

  @post('/contratos-medidores')
  @response(200, {
    description: 'ContratosMedidores model instance',
    content: {'application/json': {schema: getModelSchemaRef(ContratosMedidores)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContratosMedidores, {
            title: 'NewContratosMedidores',
            exclude: ['id'],
          }),
        },
      },
    })
    contratosMedidores: Omit<ContratosMedidores, 'id'>,
  ): Promise<ContratosMedidores> {
    return this.contratosMedidoresRepository.create(contratosMedidores);
  }

  @get('/contratos-medidores/count')
  @response(200, {
    description: 'ContratosMedidores model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ContratosMedidores) where?: Where<ContratosMedidores>,
  ): Promise<Count> {
    return this.contratosMedidoresRepository.count(where);
  }

  @get('/contratos-medidores')
  @response(200, {
    description: 'Array of ContratosMedidores model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ContratosMedidores, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ContratosMedidores) filter?: Filter<ContratosMedidores>,
  ): Promise<ContratosMedidores[]> {
    return this.contratosMedidoresRepository.find(filter);
  }

  @patch('/contratos-medidores')
  @response(200, {
    description: 'ContratosMedidores PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContratosMedidores, {partial: true}),
        },
      },
    })
    contratosMedidores: ContratosMedidores,
    @param.where(ContratosMedidores) where?: Where<ContratosMedidores>,
  ): Promise<Count> {
    return this.contratosMedidoresRepository.updateAll(contratosMedidores, where);
  }

  @get('/contratos-medidores/{id}')
  @response(200, {
    description: 'ContratosMedidores model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ContratosMedidores, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ContratosMedidores, {exclude: 'where'}) filter?: FilterExcludingWhere<ContratosMedidores>
  ): Promise<ContratosMedidores> {
    return this.contratosMedidoresRepository.findById(id, filter);
  }

  @patch('/contratos-medidores/{id}')
  @response(204, {
    description: 'ContratosMedidores PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContratosMedidores, {partial: true}),
        },
      },
    })
    contratosMedidores: ContratosMedidores,
  ): Promise<void> {
    await this.contratosMedidoresRepository.updateById(id, contratosMedidores);
  }

  @put('/contratos-medidores/{id}')
  @response(204, {
    description: 'ContratosMedidores PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() contratosMedidores: ContratosMedidores,
  ): Promise<void> {
    await this.contratosMedidoresRepository.replaceById(id, contratosMedidores);
  }

  @del('/contratos-medidores/{id}')
  @response(204, {
    description: 'ContratosMedidores DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.contratosMedidoresRepository.deleteById(id);
  }



  @get('/get-c-meter/{id}')
  async ParamtersTable(
    @param.path.number('id') id: number
  ): Promise<any> {
    let datos = await this.getTPdetail(id);
    return datos;
  }

  async getTPdetail(id: number) {

    return await this.contratosMedidoresRepository.dataSource.execute(
      `${viewOf.GET_CMETERS} Where estado = ${id}`,
    );
  }
}

