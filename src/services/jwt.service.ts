import {BindingScope, injectable, service} from '@loopback/core/dist';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {gCodeInterface} from '../core/interfaces/models/gCode.interface';
import {LoginInterface} from '../core/interfaces/models/Login.interface';
import {keys} from "../env/interfaces/Servicekeys.interface";
import {CodigoVerificacion, Credenciales} from '../models';
import {CodigoVerificacionRepository, CredencialesRepository, UsuarioRepository} from '../repositories';
import {EncriptDecryptService} from './encript-decrypt.service';
import {UserService} from "./user.service";
const jsonwebtoken = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class JWTService {
  userService: UserService;
  constructor(
    @repository(CredencialesRepository)
    private credencialesRepository: CredencialesRepository,
    @service(EncriptDecryptService)
    private encriptDecryptService: EncriptDecryptService,
    @repository(CodigoVerificacionRepository)
    private codigoVerificacionRepository: CodigoVerificacionRepository,
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository
  ) {
  }


  createToken(credentials: any, user: any) {
    try {
      let token = jsonwebtoken.sign({
        exp: keys.TOKEN_EXPIRATION_TIME,
        data: {
          UserID: credentials.id,
          UserNAME: credentials.username,
          Role: user.rolid
        }
      }, keys.JWT_SECRET_KEY);
      return token;

    } catch (error) {
      console.log("Error al generar el token: ", error);

    }
  }

  VerifyToken(token: string) {
    if (!token)
      throw new HttpErrors[401]("Token vacio")
    let decoded = jsonwebtoken.verify(token, keys.JWT_SECRET_KEY);

    if (decoded)
      return decoded;
    else
      throw new HttpErrors[401]("Token invalido");
  }

  async IdentifyToken(credentials: LoginInterface): Promise<Credenciales | false> {
    let user = await this.credencialesRepository.findOne({where: {correo: credentials.identificator}});

    if (!user)
      user = await this.credencialesRepository.findOne({where: {username: credentials.identificator}});

    if (user?.correo === credentials.identificator || user?.username === credentials.identificator) {
      let cryptPass = await this.encriptDecryptService.Encrypt(credentials.password);
      if (user.hash === cryptPass) {
        return user;
      }
    }
    return false;


  }

  async ResetPassword(identificator: string, newpassword: string): Promise<string | false> {
    let user = await this.credencialesRepository.findOne({where: {correo: identificator}});
    if (!user)
      user = await this.credencialesRepository.findOne({where: {username: identificator}});

    if (user?.correo === identificator || user?.username === identificator) {
      newpassword = this.encriptDecryptService.Encrypt(newpassword);
      user.passwordHash = newpassword;
      this.credencialesRepository.replaceById(user.id, user);
      return newpassword;
    }
    return false;
  }

  async generateCode(request: gCodeInterface) {
    const newCode = new CodigoVerificacion;
    console.log(request.identificator);

    let credentialsExist = await this.credencialesRepository.findOne({where: {correo: request.identificator}});

    if (!credentialsExist)
      throw new HttpErrors[402]("Usuario no valido")

    newCode.exp = Date.now() + keys.ONE_MINUTE_MILLISECONDS + '';
    newCode.codigo = keys.GENERATE_NEW_VERIFY_CODE;
    let user = await this.usuarioRepository.findOne({where: {correo: request.identificator}});
    if (!user?.estado)
      throw new HttpErrors[402]("Este usuario esta desactivado");

    newCode.userId = user.id;

    return await this.codigoVerificacionRepository.create(newCode);

  }

}


