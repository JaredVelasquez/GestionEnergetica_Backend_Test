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
import {MedidorVirtualDetalle} from '../models';
import {MedidorVirtualDetalleRepository} from '../repositories';

@authenticate('admin', 'owner')
export class VirtualMeterDetailController {
  constructor(
    @repository(MedidorVirtualDetalleRepository)
    public medidorVirtualDetalleRepository: MedidorVirtualDetalleRepository,
  ) { }

  @post('/medidor-virtual-detalles')
  @response(200, {
    description: 'MedidorVirtualDetalle model instance',
    content: {'application/json': {schema: getModelSchemaRef(MedidorVirtualDetalle)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedidorVirtualDetalle, {
            title: 'NewMedidorVirtualDetalle',
            exclude: ['id'],
          }),
        },
      },
    })
    medidorVirtualDetalle: Omit<MedidorVirtualDetalle, 'id'>,
  ): Promise<MedidorVirtualDetalle> {
    return this.medidorVirtualDetalleRepository.create(medidorVirtualDetalle);
  }

  @get('/medidor-virtual-detalles/count')
  @response(200, {
    description: 'MedidorVirtualDetalle model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MedidorVirtualDetalle) where?: Where<MedidorVirtualDetalle>,
  ): Promise<Count> {
    return this.medidorVirtualDetalleRepository.count(where);
  }

  @get('/medidor-virtual-detalles')
  @response(200, {
    description: 'Array of MedidorVirtualDetalle model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MedidorVirtualDetalle, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MedidorVirtualDetalle) filter?: Filter<MedidorVirtualDetalle>,
  ): Promise<MedidorVirtualDetalle[]> {
    return this.medidorVirtualDetalleRepository.find(filter);
  }

  @patch('/medidor-virtual-detalles')
  @response(200, {
    description: 'MedidorVirtualDetalle PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedidorVirtualDetalle, {partial: true}),
        },
      },
    })
    medidorVirtualDetalle: MedidorVirtualDetalle,
    @param.where(MedidorVirtualDetalle) where?: Where<MedidorVirtualDetalle>,
  ): Promise<Count> {
    return this.medidorVirtualDetalleRepository.updateAll(medidorVirtualDetalle, where);
  }

  @get('/medidor-virtual-detalles/{id}')
  @response(200, {
    description: 'MedidorVirtualDetalle model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MedidorVirtualDetalle, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MedidorVirtualDetalle, {exclude: 'where'}) filter?: FilterExcludingWhere<MedidorVirtualDetalle>
  ): Promise<MedidorVirtualDetalle> {
    return this.medidorVirtualDetalleRepository.findById(id, filter);
  }

  @patch('/medidor-virtual-detalles/{id}')
  @response(204, {
    description: 'MedidorVirtualDetalle PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedidorVirtualDetalle, {partial: true}),
        },
      },
    })
    medidorVirtualDetalle: MedidorVirtualDetalle,
  ): Promise<void> {
    await this.medidorVirtualDetalleRepository.updateById(id, medidorVirtualDetalle);
  }

  @put('/medidor-virtual-detalles/{id}')
  @response(204, {
    description: 'MedidorVirtualDetalle PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() medidorVirtualDetalle: MedidorVirtualDetalle,
  ): Promise<void> {
    await this.medidorVirtualDetalleRepository.replaceById(id, medidorVirtualDetalle);
  }

  @del('/medidor-virtual-detalles/{id}')
  @response(204, {
    description: 'MedidorVirtualDetalle DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.medidorVirtualDetalleRepository.deleteById(id);
  }

  @get('/get-vmeters-detail')
  async dataVMeterDatail(
  ): Promise<any> {
    let datos = await this.getVMetersDatail();
    return datos;
  }

  async getVMetersDatail() {

    return await this.medidorVirtualDetalleRepository.dataSource.execute(
      `${viewOf.GET_Virtual_METERS_DETAIL}`,
    );
  }
}
