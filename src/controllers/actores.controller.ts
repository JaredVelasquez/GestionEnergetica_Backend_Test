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
  getModelSchemaRef, param, patch, post, put, requestBody, response
} from '@loopback/rest';
import {viewOf} from '../core/library/views.library';
import {Actores} from '../models';
import {ActoresRepository} from '../repositories';
import {ActorService} from "../services/actor.service";

export class ActoresController {
  constructor(
    @repository(ActoresRepository)
    public actoresRepository: ActoresRepository,
    @service(ActorService)
    private actorService: ActorService,
  ) { }

  @authenticate('admin', 'owner')
  @post('/actores')
  @response(200, {
    description: 'Actores model instance',
    content: {'application/json': {schema: getModelSchemaRef(Actores)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Actores, {
            title: 'NewActores',
            exclude: ['id'],
          }),
        },
      },
    })
    actores: Omit<Actores, 'id'>,
  ): Promise<Actores> {
    return this.actoresRepository.create(actores);
  }

  @get('/actores/count')
  @response(200, {
    description: 'Actores model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Actores) where?: Where<Actores>,
  ): Promise<Count> {
    return this.actoresRepository.count(where);
  }

  @get('/actores')
  @response(200, {
    description: 'Array of Actores model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Actores, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Actores) filter?: Filter<Actores>,
  ): Promise<Actores[]> {
    return this.actoresRepository.find(filter);
  }

  @patch('/actores')
  @response(200, {
    description: 'Actores PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Actores, {partial: true}),
        },
      },
    })
    actores: Actores,
    @param.where(Actores) where?: Where<Actores>,
  ): Promise<Count> {
    return this.actoresRepository.updateAll(actores, where);
  }

  @get('/actores/{id}')
  @response(200, {
    description: 'Actores model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Actores, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Actores, {exclude: 'where'}) filter?: FilterExcludingWhere<Actores>
  ): Promise<Actores> {
    return this.actoresRepository.findById(id, filter);
  }

  @patch('/actores/{id}')
  @response(204, {
    description: 'Actores PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Actores, {partial: true}),
        },
      },
    })
    actores: Actores,
  ): Promise<void> {
    await this.actoresRepository.updateById(id, actores);
  }

  @put('/actores/{id}')
  @response(204, {
    description: 'Actores PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() actores: Actores,
  ): Promise<void> {
    await this.actoresRepository.replaceById(id, actores);
  }

  @del('/actores/{id}')
  @response(204, {
    description: 'Actores DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.actoresRepository.deleteById(id);
  }


  @get('/get-clients/{id}')
  async GetClients(
    @param.path.number('id') id: number
  ): Promise<any> {
    let datos = await this.dataClients(id);
    return datos;
  }

  async dataClients(id: number) {

    return await this.actoresRepository.dataSource.execute(
      `${viewOf.GET_Clients} Where estado = ${id}`,
    );
  }


  @get('/get-providers/{id}')
  async GetProviders(
    @param.path.number('id') id: number
  ): Promise<any> {
    let datos = await this.dataProviders(id);
    return datos;
  }

  async dataProviders(id: number) {

    return await this.actoresRepository.dataSource.execute(
      `${viewOf.GET_Providers} Where estado = ${id}`,
    );
  }
}
