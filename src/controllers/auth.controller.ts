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
import {LoginInterface} from '../core/interfaces/models/Login.interface';
import {RegisterUserInterface} from '../core/interfaces/models/RegisterUser.interface';
import {CredencialesRepository, UsuarioRepository} from '../repositories';
import {AuthService, JWTService} from '../services';
import {Usuario} from './../models/usuario.model';

export class AuthController {
  constructor(
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
    @repository(CredencialesRepository)
    private credencialesRepository: CredencialesRepository,
    @service(JWTService)
    private jwtService: JWTService,
    @service(AuthService)
    private authService: AuthService

  ) { }


  @post('/register')
  @response(200, {
    description: 'Usuario model instance',
  })
  async RegisterUser(
    @requestBody() registerUser: RegisterUserInterface
  ): Promise<any> {
    return this.authService.RegisterUser(registerUser);
  }

  @post('/login')
  @response(200, {
    description: 'Usuario model instance',
  })
  async Login(
    @requestBody() loginInterface: LoginInterface
  ): Promise<any> {
    return this.authService.Login(loginInterface);
  }

  @post('/reset-password')
  @response(200, {
    description: 'Usuario model instance',
  })
  async resetPassword(
    @requestBody() reset: {user: number, newPassword: string}
  ): Promise<any> {
    let user = await this.credencialesRepository.findOne({where: {id: reset.user}});
    if (!user?.correo) {
      return {error: 'usuario no existe'}
    }
    let result = await this.jwtService.ResetPassword(user?.correo, reset.newPassword);
    console.log(result);

    if (!result) {
      return {error: 'accion no fue completada'};
    } else {
      return true;
    }
  }



  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }
}
