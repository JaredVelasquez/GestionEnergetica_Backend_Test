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
import {TipoContratos} from '../models';
import {TipoContratosRepository} from '../repositories';

@authenticate('admin', 'owner')
export class ContractTypeController {
  constructor(
    @repository(TipoContratosRepository)
    public tipoContratosRepository: TipoContratosRepository,
  ) { }

  @post('/tipo-contratos')
  @response(200, {
    description: 'TipoContratos model instance',
    content: {'application/json': {schema: getModelSchemaRef(TipoContratos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoContratos, {
            title: 'NewTipoContratos',
            exclude: ['id'],
          }),
        },
      },
    })
    tipoContratos: Omit<TipoContratos, 'id'>,
  ): Promise<TipoContratos> {
    return this.tipoContratosRepository.create(tipoContratos);
  }

  @get('/tipo-contratos/count')
  @response(200, {
    description: 'TipoContratos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TipoContratos) where?: Where<TipoContratos>,
  ): Promise<Count> {
    return this.tipoContratosRepository.count(where);
  }

  @get('/tipo-contratos')
  @response(200, {
    description: 'Array of TipoContratos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoContratos, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TipoContratos) filter?: Filter<TipoContratos>,
  ): Promise<TipoContratos[]> {
    return this.tipoContratosRepository.find(filter);
  }

  @patch('/tipo-contratos')
  @response(200, {
    description: 'TipoContratos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoContratos, {partial: true}),
        },
      },
    })
    tipoContratos: TipoContratos,
    @param.where(TipoContratos) where?: Where<TipoContratos>,
  ): Promise<Count> {
    return this.tipoContratosRepository.updateAll(tipoContratos, where);
  }

  @get('/tipo-contratos/{id}')
  @response(200, {
    description: 'TipoContratos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoContratos, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TipoContratos, {exclude: 'where'}) filter?: FilterExcludingWhere<TipoContratos>
  ): Promise<TipoContratos> {
    return this.tipoContratosRepository.findById(id, filter);
  }

  @patch('/tipo-contratos/{id}')
  @response(204, {
    description: 'TipoContratos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoContratos, {partial: true}),
        },
      },
    })
    tipoContratos: TipoContratos,
  ): Promise<void> {
    await this.tipoContratosRepository.updateById(id, tipoContratos);
  }

  @put('/tipo-contratos/{id}')
  @response(204, {
    description: 'TipoContratos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tipoContratos: TipoContratos,
  ): Promise<void> {
    await this.tipoContratosRepository.replaceById(id, tipoContratos);
  }

  @del('/tipo-contratos/{id}')
  @response(204, {
    description: 'TipoContratos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tipoContratosRepository.deleteById(id);
  }
}
