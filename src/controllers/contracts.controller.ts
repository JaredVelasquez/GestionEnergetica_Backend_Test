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
import {viewOf} from '../core/library/views.library';
import {Contrato} from '../models';
import {ContratoRepository} from '../repositories';

@authenticate('admin', 'owner')
export class ContractsController {
  constructor(
    @repository(ContratoRepository)
    public contratoRepository: ContratoRepository,
  ) { }

  @post('/contratos')
  @response(200, {
    description: 'Contrato model instance',
    content: {'application/json': {schema: getModelSchemaRef(Contrato)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contrato, {
            title: 'NewContrato',
            exclude: ['id'],
          }),
        },
      },
    })
    contrato: Omit<Contrato, 'id'>,
  ): Promise<Contrato> {
    return this.contratoRepository.create(contrato);
  }

  @get('/contratos/count')
  @response(200, {
    description: 'Contrato model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Contrato) where?: Where<Contrato>,
  ): Promise<Count> {
    return this.contratoRepository.count(where);
  }

  @get('/contratos')
  @response(200, {
    description: 'Array of Contrato model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Contrato, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Contrato) filter?: Filter<Contrato>,
  ): Promise<Contrato[]> {
    return this.contratoRepository.find(filter);
  }

  @patch('/contratos')
  @response(200, {
    description: 'Contrato PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contrato, {partial: true}),
        },
      },
    })
    contrato: Contrato,
    @param.where(Contrato) where?: Where<Contrato>,
  ): Promise<Count> {
    return this.contratoRepository.updateAll(contrato, where);
  }

  @get('/contratos/{id}')
  @response(200, {
    description: 'Contrato model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Contrato, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Contrato, {exclude: 'where'}) filter?: FilterExcludingWhere<Contrato>
  ): Promise<Contrato> {
    return this.contratoRepository.findById(id, filter);
  }

  @patch('/contratos/{id}')
  @response(204, {
    description: 'Contrato PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contrato, {partial: true}),
        },
      },
    })
    contrato: Contrato,
  ): Promise<void> {
    await this.contratoRepository.updateById(id, contrato);
  }

  @put('/contratos/{id}')
  @response(204, {
    description: 'Contrato PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() contrato: Contrato,
  ): Promise<void> {
    await this.contratoRepository.replaceById(id, contrato);
  }

  @del('/contratos/{id}')
  @response(204, {
    description: 'Contrato DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.contratoRepository.deleteById(id);
  }

  @get('/get-contracts/{id}')
  async ContractsTable(
    @param.path.number('id') id: number
  ): Promise<any> {
    let datos = await this.getContracts(id);
    return datos;
  }

  async getContracts(id: number) {

    return await this.contratoRepository.dataSource.execute(
      `${viewOf.GET_CONTRACTS} Where estado = ${id}`,
    );
  }

}
