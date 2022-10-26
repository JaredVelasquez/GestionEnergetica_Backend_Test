import { /* inject, */ BindingScope, injectable, service} from '@loopback/core/dist';
import {repository} from '@loopback/repository';
import {LoginInterface} from '../core/interfaces/models/Login.interface';
import {credentialShema, RegisterUserInterface} from '../core/interfaces/models/RegisterUser.interface';
import {error} from '../core/library/errors.library';
import {Credenciales, Usuario} from '../models';
import {ActoresRepository, CodigoVerificacionRepository, CredencialesRepository, UsuarioRepository} from '../repositories';
import {EncriptDecryptService} from './encript-decrypt.service';
import {JWTService} from './jwt.service';
var shortid = require('shortid-36');

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(
    @repository(CredencialesRepository)
    private credencialesRepository: CredencialesRepository,
    @repository(CodigoVerificacionRepository)
    private codigoVerificacionRepository: CodigoVerificacionRepository,
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

    let credentials = await this.credencialesRepository.findOne({where: {correo: loginInterface.identificator}});
    console.log(credentials);
    if (!credentials)
      credentials = await this.credencialesRepository.findOne({where: {username: loginInterface.identificator}});
    console.log(credentials);

    if (!credentials)
      return error.CREDENTIALS_NOT_REGISTER;

    let user = await this.usuarioRepository.findOne({where: {correo: credentials.correo}});

    if (!user)
      return error.CREDENTIALS_NOT_REGISTER;
    console.log(user);

    let matchCredencials = await this.jwtService.IdentifyToken(loginInterface)


    if (!matchCredencials)
      return error.INVALID_PASSWORD;

    const auth = {
      token: await this.jwtService.createToken(matchCredencials, user),
      usuario: JSON.stringify(user),
      rol: user.rolid
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

  async createCredentials(credencialShema: credentialShema) {
    let modelCredentials: Credenciales = new Credenciales;


    let newHash = this.encriptDecryptService.Encrypt(credencialShema.newPassword);

    modelCredentials.correo = credencialShema.correo;
    modelCredentials.username = credencialShema.username;
    modelCredentials.hash = newHash;

    await this.credencialesRepository.create(modelCredentials);

    return true;
  }

  async updateCredencials(credencialShema: credentialShema) {
    let modelCredentials: Credenciales = new Credenciales;
    console.log("Recibido de front:");

    console.log(credencialShema);

    let credentialExist = await this.credencialesRepository.findOne({where: {correo: credencialShema.correo}});

    if (!credentialExist) {
      return false;
    }

    let newHash = this.encriptDecryptService.Encrypt(credencialShema.newPassword);

    modelCredentials.correo = credencialShema.correo;
    modelCredentials.username = credencialShema.username;
    modelCredentials.hash = newHash;
    console.log(modelCredentials);
    console.log(credentialExist);

    await this.credencialesRepository.updateById(credentialExist.id, modelCredentials);
    console.log("se cambio contra");

    return true;
  }


}
