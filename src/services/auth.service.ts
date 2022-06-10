import { /* inject, */ BindingScope, injectable, service} from '@loopback/core/dist';
import {repository} from '@loopback/repository';
import {LoginInterface} from '../core/interfaces/models/Login.interface';
import {RegisterUserInterface} from '../core/interfaces/models/RegisterUser.interface';
import {error} from '../core/library/errors.library';
import {Credenciales, Usuario} from '../models';
import {ActoresRepository, CredencialesRepository, UsuarioRepository} from '../repositories';
import {EncriptDecryptService} from './encript-decrypt.service';
import {JWTService} from './jwt.service';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(
    @repository(CredencialesRepository)
    private credencialesRepository: CredencialesRepository,
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
    @service(JWTService)
    private jwtService: JWTService,
    @repository(ActoresRepository)
    private actoresRepository: ActoresRepository,
    @service(EncriptDecryptService)
    private encriptDecryptService: EncriptDecryptService,

  ) {
  }

  async Login(loginInterface: LoginInterface) {

    if (!loginInterface)
      return error.EMTY_CREDENTIALS;

    let user = await this.usuarioRepository.findOne({where: {correo: loginInterface.identificator}});
    if (!user)
      user = await this.usuarioRepository.findOne({where: {username: loginInterface.identificator}});

    if (!user)
      return error.CREDENTIALS_NOT_REGISTER;

    let matchCredencials = await this.jwtService.IdentifyToken(loginInterface)

    if (!matchCredencials)
      return error.INVALID_PASSWORD;

    const auth = {
      token: await this.jwtService.createToken(matchCredencials, user),
    }

    return auth;


  }

  async RegisterUser(registerUser: RegisterUserInterface): Promise<boolean | any> {
    let modelUser: Usuario = new Usuario;
    let modelCredentials: Credenciales = new Credenciales;

    let userExist = await this.credencialesRepository.findOne({where: {correo: registerUser.email}});

    if (userExist)
      return error.INVALID_EMAIL;

    if (!userExist)
      userExist = await this.credencialesRepository.findOne({where: {username: registerUser.username}});

    if (userExist)
      return error.INVALID_USERNAME;

    if (!userExist)
      userExist = await this.usuarioRepository.findOne({where: {telefono: registerUser.phoneNumber}});

    if (userExist)
      return error.INVALID_PHONENUMBER;

    modelUser.rolid = registerUser.rolId;
    modelUser.nombre = registerUser.firstName;
    modelUser.apellido = registerUser.lastName;
    modelUser.correo = registerUser.email;
    modelUser.estado = true;
    modelUser.telefono = registerUser.phoneNumber;

    await this.usuarioRepository.create(modelUser);

    let newHash = this.encriptDecryptService.Encrypt(registerUser.password);

    modelCredentials.correo = registerUser.email;
    modelCredentials.username = registerUser.username;
    modelCredentials.hash = newHash;

    await this.credencialesRepository.create(modelCredentials);

    return true;
  }

}
