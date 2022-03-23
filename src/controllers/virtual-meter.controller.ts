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
import {MedidorVirtual} from '../models';
import {MedidorVirtualRepository} from '../repositories';

export class VirtualMeterController {
  constructor(
    @repository(MedidorVirtualRepository)
    public medidorVirtualRepository: MedidorVirtualRepository,
  ) { }

  @post('/medidor-virtuals')
  @response(200, {
    description: 'MedidorVirtual model instance',
    content: {'application/json': {schema: getModelSchemaRef(MedidorVirtual)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedidorVirtual, {
            title: 'NewMedidorVirtual',
            exclude: ['id'],
          }),
        },
      },
    })
    medidorVirtual: Omit<MedidorVirtual, 'id'>,
  ): Promise<MedidorVirtual> {
    return this.medidorVirtualRepository.create(medidorVirtual);
  }

  @get('/medidor-virtuals/count')
  @response(200, {
    description: 'MedidorVirtual model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MedidorVirtual) where?: Where<MedidorVirtual>,
  ): Promise<Count> {
    return this.medidorVirtualRepository.count(where);
  }

  @get('/medidor-virtuals')
  @response(200, {
    description: 'Array of MedidorVirtual model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MedidorVirtual, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MedidorVirtual) filter?: Filter<MedidorVirtual>,
  ): Promise<MedidorVirtual[]> {
    return this.medidorVirtualRepository.find(filter);
  }

  @patch('/medidor-virtuals')
  @response(200, {
    description: 'MedidorVirtual PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedidorVirtual, {partial: true}),
        },
      },
    })
    medidorVirtual: MedidorVirtual,
    @param.where(MedidorVirtual) where?: Where<MedidorVirtual>,
  ): Promise<Count> {
    return this.medidorVirtualRepository.updateAll(medidorVirtual, where);
  }

  @get('/medidor-virtuals/{id}')
  @response(200, {
    description: 'MedidorVirtual model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MedidorVirtual, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MedidorVirtual, {exclude: 'where'}) filter?: FilterExcludingWhere<MedidorVirtual>
  ): Promise<MedidorVirtual> {
    return this.medidorVirtualRepository.findById(id, filter);
  }

  @patch('/medidor-virtuals/{id}')
  @response(204, {
    description: 'MedidorVirtual PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedidorVirtual, {partial: true}),
        },
      },
    })
    medidorVirtual: MedidorVirtual,
  ): Promise<void> {
    await this.medidorVirtualRepository.updateById(id, medidorVirtual);
  }

  @put('/medidor-virtuals/{id}')
  @response(204, {
    description: 'MedidorVirtual PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() medidorVirtual: MedidorVirtual,
  ): Promise<void> {
    await this.medidorVirtualRepository.replaceById(id, medidorVirtual);
  }

  @del('/medidor-virtuals/{id}')
  @response(204, {
    description: 'MedidorVirtual DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.medidorVirtualRepository.deleteById(id);
  }

  @get('/get-vmeters/{id}')
  async dataVMeter(
    @param.path.number('id') id: number
  ): Promise<any> {
    let datos = await this.getVMeters(id);
    return datos;
  }

  async getVMeters(id: number) {

    return await this.medidorVirtualRepository.dataSource.execute(
      `${viewOf.GET_Virtual_METERS} Where estado = ${id}`,
    );
  }
}
