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
import {RegistroManual} from '../models';
import {MedidorRepository, RegistroManualRepository, VariablesRepository} from '../repositories';

@authenticate('admin', 'owner')
export class ManualRegistrationController {
  constructor(
    @repository(RegistroManualRepository)
    public registroManualRepository: RegistroManualRepository,
    @repository(VariablesRepository)
    public variablesRepository: VariablesRepository,
    @repository(MedidorRepository)
    public medidorRepository: MedidorRepository,
  ) { }

  @post('/registro-manuals')
  @response(200, {
    description: 'RegistroManual model instance',
    content: {'application/json': {schema: getModelSchemaRef(RegistroManual)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistroManual, {
            title: 'NewRegistroManual',
            exclude: ['id'],
          }),
        },
      },
    })
    registroManual: Omit<RegistroManual, 'id'>,
  ): Promise<any> {
    let newRegister = await this.registroManualRepository.create(registroManual);

    if (!newRegister)
      return "error fallo el registro del registro";

    let variable = await this.variablesRepository.findOne({where: {id: (await newRegister).variableId}});

    if (!variable)
      return "error fallo al obtener variable"

    let medidor = await this.medidorRepository.findOne({where: {id: (await newRegister).medidorId}});

    if (!medidor)
      return "error fallo obtener el medidor";

    let result = {
      ...newRegister,
      codigo: medidor?.codigo,
      descripcion: variable?.descripcion,
    }

    return result;
  }

  @get('/registro-manuals/count')
  @response(200, {
    description: 'RegistroManual model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RegistroManual) where?: Where<RegistroManual>,
  ): Promise<Count> {
    return this.registroManualRepository.count(where);
  }

  @get('/registro-manuals')
  @response(200, {
    description: 'Array of RegistroManual model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RegistroManual, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RegistroManual) filter?: Filter<RegistroManual>,
  ): Promise<RegistroManual[]> {
    return this.registroManualRepository.find(filter);
  }

  @patch('/registro-manuals')
  @response(200, {
    description: 'RegistroManual PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistroManual, {partial: true}),
        },
      },
    })
    registroManual: RegistroManual,
    @param.where(RegistroManual) where?: Where<RegistroManual>,
  ): Promise<Count> {
    return this.registroManualRepository.updateAll(registroManual, where);
  }

  @get('/registro-manuals/{id}')
  @response(200, {
    description: 'RegistroManual model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RegistroManual, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RegistroManual, {exclude: 'where'}) filter?: FilterExcludingWhere<RegistroManual>
  ): Promise<RegistroManual> {
    return this.registroManualRepository.findById(id, filter);
  }

  @patch('/registro-manuals/{id}')
  @response(204, {
    description: 'RegistroManual PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistroManual, {partial: true}),
        },
      },
    })
    registroManual: RegistroManual,
  ): Promise<void> {
    await this.registroManualRepository.updateById(id, registroManual);
  }

  @put('/registro-manuals/{id}')
  @response(204, {
    description: 'RegistroManual PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() registroManual: RegistroManual,
  ): Promise<void> {
    await this.registroManualRepository.replaceById(id, registroManual);
  }

  @del('/registro-manuals/{id}')
  @response(204, {
    description: 'RegistroManual DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.registroManualRepository.deleteById(id);
  }

  @get('/get-registros-manuales')
  async ManualAllRegisters(
  ): Promise<any> {
    let datos = await this.getManualAllRegister();
    return datos;
  }

  async getManualAllRegister() {

    return await this.registroManualRepository.dataSource.execute(
      `${viewOf.GET_MANUAL_REGISTERS}`,
    );
  }

  @get('/get-registros-manuales/{id}')
  async ManualRegisters(
    @param.path.number('id') id: number
  ): Promise<any> {
    let datos = await this.getManualRegister(id);
    return datos;
  }

  async getManualRegister(id: number) {

    return await this.registroManualRepository.dataSource.execute(
      `${viewOf.GET_MANUAL_REGISTERS} Where estado = ${id}`,
    );
  }
}
