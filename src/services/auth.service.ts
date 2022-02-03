import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {gCodeInterface} from '../core/interfaces/models/gCode.interface';
import {keys} from "../env/interfaces/Servicekeys.interface";
import {CodigoVerificacion, Credenciales, Usuario} from '../models';
import {CodigoVerificacionRepository, CredencialesRepository, UsuarioRepository} from '../repositories';
import {UserService} from "../services/user.service";
import {EncriptDecryptService} from './encript-decrypt.service';
const jsonwebtoken = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
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


  createToken(credentials: Credenciales, user: Usuario) {
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

  async IdentifyToken(identificador: string, password: string): Promise<Credenciales | false> {
    let user = await this.credencialesRepository.findOne({where: {correo: identificador} || {username: identificador}});

    if (user) {
      let cryptPass = this.encriptDecryptService.Encrypt(password);
      if (user.passwordHash == cryptPass) {
        return user;
      }
    }
    return false;
  }

  async ResetPassword(identificador: string, newpassword: string): Promise<string | false> {
    let user = await this.credencialesRepository.findOne({where: {correo: identificador} || {username: identificador}});
    if (user) {
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

    return this.codigoVerificacionRepository.create(newCode);

  }

}


