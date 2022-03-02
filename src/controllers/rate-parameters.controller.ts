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
import {ParametroTarifa} from '../models';
import {ParametroTarifaRepository} from '../repositories';

export class RateParametersController {
  constructor(
    @repository(ParametroTarifaRepository)
    public parametroTarifaRepository: ParametroTarifaRepository,
  ) { }

  @post('/parametro-tarifas')
  @response(200, {
    description: 'ParametroTarifa model instance',
    content: {'application/json': {schema: getModelSchemaRef(ParametroTarifa)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ParametroTarifa, {
            title: 'NewParametroTarifa',
            exclude: ['id'],
          }),
        },
      },
    })
    parametroTarifa: Omit<ParametroTarifa, 'id'>,
  ): Promise<ParametroTarifa> {
    return this.parametroTarifaRepository.create(parametroTarifa);
  }

  @get('/parametro-tarifas/count')
  @response(200, {
    description: 'ParametroTarifa model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ParametroTarifa) where?: Where<ParametroTarifa>,
  ): Promise<Count> {
    return this.parametroTarifaRepository.count(where);
  }

  @get('/parametro-tarifas')
  @response(200, {
    description: 'Array of ParametroTarifa model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ParametroTarifa, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ParametroTarifa) filter?: Filter<ParametroTarifa>,
  ): Promise<ParametroTarifa[]> {
    return this.parametroTarifaRepository.find(filter);
  }

  @patch('/parametro-tarifas')
  @response(200, {
    description: 'ParametroTarifa PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ParametroTarifa, {partial: true}),
        },
      },
    })
    parametroTarifa: ParametroTarifa,
    @param.where(ParametroTarifa) where?: Where<ParametroTarifa>,
  ): Promise<Count> {
    return this.parametroTarifaRepository.updateAll(parametroTarifa, where);
  }

  @get('/parametro-tarifas/{id}')
  @response(200, {
    description: 'ParametroTarifa model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ParametroTarifa, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ParametroTarifa, {exclude: 'where'}) filter?: FilterExcludingWhere<ParametroTarifa>
  ): Promise<ParametroTarifa> {
    return this.parametroTarifaRepository.findById(id, filter);
  }

  @patch('/parametro-tarifas/{id}')
  @response(204, {
    description: 'ParametroTarifa PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ParametroTarifa, {partial: true}),
        },
      },
    })
    parametroTarifa: ParametroTarifa,
  ): Promise<void> {
    await this.parametroTarifaRepository.updateById(id, parametroTarifa);
  }

  @put('/parametro-tarifas/{id}')
  @response(204, {
    description: 'ParametroTarifa PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() parametroTarifa: ParametroTarifa,
  ): Promise<void> {
    await this.parametroTarifaRepository.replaceById(id, parametroTarifa);
  }

  @del('/parametro-tarifas/{id}')
  @response(204, {
    description: 'ParametroTarifa DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.parametroTarifaRepository.deleteById(id);
  }

  @get('/get-parameter/{id}')
  async ParamtersTable(
    @param.path.number('id') id: number
  ): Promise<any> {
    let datos = await this.getParameters(id);
    return datos;
  }

  async getParameters(id: number) {

    return await this.parametroTarifaRepository.dataSource.execute(
      `${viewOf.GET_RATE_PARAMETERS} Where id = ${id}`,
    );
  }

  @get('/get-allparameters')
  async InputParamtersTable(): Promise<any> {
    let datos: any[] = await this.getAllParameters();
    return datos;
  }

  async getAllParameters() {

    return await this.parametroTarifaRepository.dataSource.execute(
      viewOf.GET_ALL_PARAMETERS,
    );
  }
}