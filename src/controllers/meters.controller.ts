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
import {Medidor} from '../models';
import {MedidorRepository} from '../repositories';

export class MetersController {
  constructor(
    @repository(MedidorRepository)
    public medidorRepository: MedidorRepository,
  ) { }

  @post('/medidors')
  @response(200, {
    description: 'Medidor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Medidor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Medidor, {
            title: 'NewMedidor',
            exclude: ['id'],
          }),
        },
      },
    })
    medidor: Omit<Medidor, 'id'>,
  ): Promise<Medidor> {
    return this.medidorRepository.create(medidor);
  }

  @get('/medidors/count')
  @response(200, {
    description: 'Medidor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Medidor) where?: Where<Medidor>,
  ): Promise<Count> {
    return this.medidorRepository.count(where);
  }

  @get('/medidors')
  @response(200, {
    description: 'Array of Medidor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Medidor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Medidor) filter?: Filter<Medidor>,
  ): Promise<Medidor[]> {
    return this.medidorRepository.find(filter);
  }

  @patch('/medidors')
  @response(200, {
    description: 'Medidor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Medidor, {partial: true}),
        },
      },
    })
    medidor: Medidor,
    @param.where(Medidor) where?: Where<Medidor>,
  ): Promise<Count> {
    return this.medidorRepository.updateAll(medidor, where);
  }

  @get('/medidors/{id}')
  @response(200, {
    description: 'Medidor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Medidor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Medidor, {exclude: 'where'}) filter?: FilterExcludingWhere<Medidor>
  ): Promise<Medidor> {
    return this.medidorRepository.findById(id, filter);
  }

  @patch('/medidors/{id}')
  @response(204, {
    description: 'Medidor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Medidor, {partial: true}),
        },
      },
    })
    medidor: Medidor,
  ): Promise<void> {
    await this.medidorRepository.updateById(id, medidor);
  }

  @put('/medidors/{id}')
  @response(204, {
    description: 'Medidor PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() medidor: Medidor,
  ): Promise<void> {
    await this.medidorRepository.replaceById(id, medidor);
  }

  @del('/medidors/{id}')
  @response(204, {
    description: 'Medidor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.medidorRepository.deleteById(id);
  }


  @get('/get-meters')
  async CommunityPost(): Promise<any> {
    let datos: any[] = await this.getView();
    return datos;
  }

  async getView() {
    return await this.medidorRepository.dataSource.execute(
      viewOf.GET_METERS,
    );
  }
}
