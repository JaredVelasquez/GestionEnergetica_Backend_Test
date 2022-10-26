import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core/dist';
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
import {InvoicesInterface} from '../core/interfaces/models/invoices.interface';
import {viewOf} from '../core/library/views.library';
import {Factura} from '../models';
import {FacturaRepository} from '../repositories';
import {InvoicesService} from '../services';

export class InvoicesController {
  constructor(
    @repository(FacturaRepository)
    public facturaRepository: FacturaRepository,
    @service(InvoicesService)
    private invoicesService: InvoicesService
  ) { }


  @authenticate('admin', 'owner', 'viewer')
  @post('/facturas')
  @response(200, {
    description: 'Crear factura y factura detalle',
  })
  async RegisterUser(
    @requestBody() Invoices: InvoicesInterface
  ): Promise<any> {
    return this.invoicesService.CreateInvoice(Invoices);
  }

  @get('/facturas/count')
  @response(200, {
    description: 'Factura model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Factura) where?: Where<Factura>,
  ): Promise<Count> {
    return this.facturaRepository.count(where);
  }

  @get('/facturas')
  @response(200, {
    description: 'Array of Factura model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Factura, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Factura) filter?: Filter<Factura>,
  ): Promise<Factura[]> {
    return this.facturaRepository.find(filter);
  }

  @patch('/facturas')
  @response(200, {
    description: 'Factura PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, {partial: true}),
        },
      },
    })
    factura: Factura,
    @param.where(Factura) where?: Where<Factura>,
  ): Promise<Count> {
    return this.facturaRepository.updateAll(factura, where);
  }

  @get('/facturas/{id}')
  @response(200, {
    description: 'Factura model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Factura, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Factura, {exclude: 'where'}) filter?: FilterExcludingWhere<Factura>
  ): Promise<Factura> {
    return this.facturaRepository.findById(id, filter);
  }

  @patch('/facturas/{id}')
  @response(204, {
    description: 'Factura PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, {partial: true}),
        },
      },
    })
    factura: Factura,
  ): Promise<void> {
    await this.facturaRepository.updateById(id, factura);
  }

  @put('/facturas/{id}')
  @response(204, {
    description: 'Factura PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() factura: Factura,
  ): Promise<void> {
    await this.facturaRepository.replaceById(id, factura);
  }

  @del('/facturas/{id}')
  @response(204, {
    description: 'Factura DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.facturaRepository.deleteById(id);
  }


  @get('/get-invoices/{id}')
  async InvoicesTables(
    @param.path.number('id') id: number
  ): Promise<any> {
    let datos = await this.getInvoices(id);
    return datos;
  }

  async getInvoices(id: number) {

    return await this.facturaRepository.dataSource.execute(
      `${viewOf.GET_INVOICES} Where estado = ${id} `,
    );
  }

  @get('/get-invoices-contract/{id}')
  async InvoiceHistoric(
    @param.path.number('id') id: number
  ): Promise<any> {
    let datos = await this.getHistoric(id);
    return datos;
  }

  async getHistoric(id: number) {

    return await this.facturaRepository.dataSource.execute(
      `${viewOf.GET_INVOICES} Where estado = 2 and contratoId = ${id} ORDER BY fechaInicio ASC`,
    );
  }

}
