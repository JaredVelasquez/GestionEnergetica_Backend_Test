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
import {CargosFactura} from '../models';
import {CargosFacturaRepository} from '../repositories';


@authenticate('admin', 'owner')
export class EspecialChargesController {
  constructor(
    @repository(CargosFacturaRepository)
    public cargosFacturaRepository: CargosFacturaRepository,
  ) { }

  @post('/cargos-facturas')
  @response(200, {
    description: 'CargosFactura model instance',
    content: {'application/json': {schema: getModelSchemaRef(CargosFactura)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CargosFactura, {
            title: 'NewCargosFactura',
            exclude: ['id'],
          }),
        },
      },
    })
    cargosFactura: Omit<CargosFactura, 'id'>,
  ): Promise<CargosFactura> {
    return this.cargosFacturaRepository.create(cargosFactura);
  }

  @get('/cargos-facturas/count')
  @response(200, {
    description: 'CargosFactura model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CargosFactura) where?: Where<CargosFactura>,
  ): Promise<Count> {
    return this.cargosFacturaRepository.count(where);
  }

  @get('/cargos-facturas')
  @response(200, {
    description: 'Array of CargosFactura model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CargosFactura, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CargosFactura) filter?: Filter<CargosFactura>,
  ): Promise<CargosFactura[]> {
    return this.cargosFacturaRepository.find(filter);
  }

  @patch('/cargos-facturas')
  @response(200, {
    description: 'CargosFactura PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CargosFactura, {partial: true}),
        },
      },
    })
    cargosFactura: CargosFactura,
    @param.where(CargosFactura) where?: Where<CargosFactura>,
  ): Promise<Count> {
    return this.cargosFacturaRepository.updateAll(cargosFactura, where);
  }

  @get('/cargos-facturas/{id}')
  @response(200, {
    description: 'CargosFactura model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CargosFactura, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CargosFactura, {exclude: 'where'}) filter?: FilterExcludingWhere<CargosFactura>
  ): Promise<CargosFactura> {
    return this.cargosFacturaRepository.findById(id, filter);
  }

  @patch('/cargos-facturas/{id}')
  @response(204, {
    description: 'CargosFactura PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CargosFactura, {partial: true}),
        },
      },
    })
    cargosFactura: CargosFactura,
  ): Promise<void> {
    await this.cargosFacturaRepository.updateById(id, cargosFactura);
  }

  @put('/cargos-facturas/{id}')
  @response(204, {
    description: 'CargosFactura PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() cargosFactura: CargosFactura,
  ): Promise<void> {
    await this.cargosFacturaRepository.replaceById(id, cargosFactura);
  }

  @del('/cargos-facturas/{id}')
  @response(204, {
    description: 'CargosFactura DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.cargosFacturaRepository.deleteById(id);
  }


  @get('/get-especial-charges/{id}')
  async EspecialChargesTable(
    @param.path.number('id') id: number
  ): Promise<any> {
    let datos = await this.getEspecialCharges(id);
    return datos;
  }

  async getEspecialCharges(id: number) {

    return await this.cargosFacturaRepository.dataSource.execute(
      `${viewOf.GET_ESPECIAL_CHARGES} Where estado = ${id}`,
    );
  }

}
