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
import {FacturaManual} from '../models';
import {FacturaManualRepository} from '../repositories';

@authenticate('admin', 'owner')
export class FacturaManualController {
  constructor(
    @repository(FacturaManualRepository)
    public facturaManualRepository: FacturaManualRepository,
  ) { }

  @post('/factura-manuals')
  @response(200, {
    description: 'FacturaManual model instance',
    content: {'application/json': {schema: getModelSchemaRef(FacturaManual)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FacturaManual, {
            title: 'NewFacturaManual',
            exclude: ['id'],
          }),
        },
      },
    })
    facturaManual: Omit<FacturaManual, 'id'>,
  ): Promise<FacturaManual> {
    return this.facturaManualRepository.create(facturaManual);
  }

  @get('/factura-manuals/count')
  @response(200, {
    description: 'FacturaManual model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FacturaManual) where?: Where<FacturaManual>,
  ): Promise<Count> {
    return this.facturaManualRepository.count(where);
  }

  @get('/factura-manuals')
  @response(200, {
    description: 'Array of FacturaManual model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FacturaManual, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FacturaManual) filter?: Filter<FacturaManual>,
  ): Promise<FacturaManual[]> {
    return this.facturaManualRepository.find(filter);
  }

  @patch('/factura-manuals')
  @response(200, {
    description: 'FacturaManual PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FacturaManual, {partial: true}),
        },
      },
    })
    facturaManual: FacturaManual,
    @param.where(FacturaManual) where?: Where<FacturaManual>,
  ): Promise<Count> {
    return this.facturaManualRepository.updateAll(facturaManual, where);
  }

  @get('/factura-manuals/{id}')
  @response(200, {
    description: 'FacturaManual model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FacturaManual, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FacturaManual, {exclude: 'where'}) filter?: FilterExcludingWhere<FacturaManual>
  ): Promise<FacturaManual> {
    return this.facturaManualRepository.findById(id, filter);
  }

  @patch('/factura-manuals/{id}')
  @response(204, {
    description: 'FacturaManual PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FacturaManual, {partial: true}),
        },
      },
    })
    facturaManual: FacturaManual,
  ): Promise<void> {
    await this.facturaManualRepository.updateById(id, facturaManual);
  }

  @put('/factura-manuals/{id}')
  @response(204, {
    description: 'FacturaManual PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() facturaManual: FacturaManual,
  ): Promise<void> {
    await this.facturaManualRepository.replaceById(id, facturaManual);
  }

  @del('/factura-manuals/{id}')
  @response(204, {
    description: 'FacturaManual DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.facturaManualRepository.deleteById(id);
  }
}
