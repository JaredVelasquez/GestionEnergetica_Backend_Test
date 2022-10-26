import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core/dist';
import {
  repository
} from '@loopback/repository';
import {
  post, requestBody,
  response
} from '@loopback/rest';
import {LoginInterface} from '../core/interfaces/models/Login.interface';
import {credentialShema, RegisterUserInterface, resetPassword} from '../core/interfaces/models/RegisterUser.interface';
import {CredencialesRepository, UsuarioRepository} from '../repositories';
import {AuthService, JWTService} from '../services';

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

  @authenticate.skip()
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
    @requestBody() reset: resetPassword
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

  @post('/create-credentials')
  @response(200, {
    description: 'Usuario model instance',
  })
  async CreateCredentials(
    @requestBody() credentials: credentialShema
  ): Promise<any> {
    return this.authService.createCredentials(credentials);
  }

  @post('/update-credentials')
  @response(200, {
    description: 'Usuario model instance',
  })
  async UpdateCredentials(
    @requestBody() credentials: credentialShema
  ): Promise<any> {
    return this.authService.updateCredencials(credentials);
  }

}
