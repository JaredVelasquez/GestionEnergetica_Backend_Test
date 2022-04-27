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
import {DetalleFacturaManual} from '../models';
import {DetalleFacturaManualRepository} from '../repositories';

export class ManualInvoiceDetailController {
  constructor(
    @repository(DetalleFacturaManualRepository)
    public detalleFacturaManualRepository: DetalleFacturaManualRepository,
  ) { }

  @post('/detalle-factura-manuals')
  @response(200, {
    description: 'DetalleFacturaManual model instance',
    content: {'application/json': {schema: getModelSchemaRef(DetalleFacturaManual)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DetalleFacturaManual, {
            title: 'NewDetalleFacturaManual',
            exclude: ['id'],
          }),
        },
      },
    })
    detalleFacturaManual: Omit<DetalleFacturaManual, 'id'>,
  ): Promise<DetalleFacturaManual> {
    return this.detalleFacturaManualRepository.create(detalleFacturaManual);
  }

  @get('/detalle-factura-manuals/count')
  @response(200, {
    description: 'DetalleFacturaManual model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DetalleFacturaManual) where?: Where<DetalleFacturaManual>,
  ): Promise<Count> {
    return this.detalleFacturaManualRepository.count(where);
  }

  @get('/detalle-factura-manuals')
  @response(200, {
    description: 'Array of DetalleFacturaManual model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DetalleFacturaManual, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DetalleFacturaManual) filter?: Filter<DetalleFacturaManual>,
  ): Promise<DetalleFacturaManual[]> {
    return this.detalleFacturaManualRepository.find(filter);
  }

  @patch('/detalle-factura-manuals')
  @response(200, {
    description: 'DetalleFacturaManual PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DetalleFacturaManual, {partial: true}),
        },
      },
    })
    detalleFacturaManual: DetalleFacturaManual,
    @param.where(DetalleFacturaManual) where?: Where<DetalleFacturaManual>,
  ): Promise<Count> {
    return this.detalleFacturaManualRepository.updateAll(detalleFacturaManual, where);
  }

  @get('/detalle-factura-manuals/{id}')
  @response(200, {
    description: 'DetalleFacturaManual model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DetalleFacturaManual, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(DetalleFacturaManual, {exclude: 'where'}) filter?: FilterExcludingWhere<DetalleFacturaManual>
  ): Promise<DetalleFacturaManual> {
    return this.detalleFacturaManualRepository.findById(id, filter);
  }

  @patch('/detalle-factura-manuals/{id}')
  @response(204, {
    description: 'DetalleFacturaManual PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DetalleFacturaManual, {partial: true}),
        },
      },
    })
    detalleFacturaManual: DetalleFacturaManual,
  ): Promise<void> {
    await this.detalleFacturaManualRepository.updateById(id, detalleFacturaManual);
  }

  @put('/detalle-factura-manuals/{id}')
  @response(204, {
    description: 'DetalleFacturaManual PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() detalleFacturaManual: DetalleFacturaManual,
  ): Promise<void> {
    await this.detalleFacturaManualRepository.replaceById(id, detalleFacturaManual);
  }

  @del('/detalle-factura-manuals/{id}')
  @response(204, {
    description: 'DetalleFacturaManual DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.detalleFacturaManualRepository.deleteById(id);
  }


  @get('/get-manual-invoices-detail')
  async ParamtersTable(
  ): Promise<any> {
    let datos = await this.getTPdetail();
    return datos;
  }

  async getTPdetail() {

    return await this.detalleFacturaManualRepository.dataSource.execute(
      `${viewOf.GET_MANUAL_INVOICE_DETAIL}`,
    );
  }

}
