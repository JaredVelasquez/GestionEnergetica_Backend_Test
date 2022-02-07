import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {LoginInterface} from '../core/interfaces/models/Login.interface';
import {RegisterUserInterface} from '../core/interfaces/models/RegisterUser.interface';
import {error} from '../core/library/errors.library';
import {Actores, Credenciales, Usuario} from '../models';
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
    let modelActor: Actores = new Actores;
    let modelUser: Usuario = new Usuario;
    let modelCredentials: Credenciales = new Credenciales;

    let userExist = await this.credencialesRepository.findOne({where: {correo: registerUser.email}});

    if (!userExist)
      userExist = await this.credencialesRepository.findOne({where: {username: registerUser.username}});

    console.log(userExist);

    if (userExist)
      throw new HttpErrors[401]("Estas correo o nombre de usuario ya esta registrado.");

    let estado = true;
    modelActor.codigo = registerUser.code;
    modelActor.tipoActor = registerUser.userType;

    let newActor = await this.actoresRepository.create(modelActor);
    if (!newActor)
      throw new HttpErrors[401]("No se pudo crear el actor");

    modelUser.actorId = newActor.id;
    modelUser.rolid = registerUser.roleId;
    modelUser.nombre = registerUser.firstName;
    modelUser.apellido = registerUser.lastName;
    modelUser.correo = registerUser.email;
    modelUser.estado = estado;

    let newUser = await this.usuarioRepository.create(modelUser);
    console.log(newUser);
    if (!newUser)
      throw new HttpErrors[401]("No se pudo crear el Usuario");

    let newHash = this.encriptDecryptService.Encrypt(registerUser.password);

    if (!newHash)
      throw new HttpErrors[401]("No se pudo crear el Hash");

    modelCredentials.correo = registerUser.email;
    modelCredentials.username = registerUser.username;
    modelCredentials.hash = newHash;

    let newCredentials = await this.credencialesRepository.create(modelCredentials);

    return true;
  }

}
