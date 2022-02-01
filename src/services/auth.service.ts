import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {token} from '../core/interfaces/models/token.interface';
import {keys} from "../env/interfaces/Servicekeys.interface";
import {Credenciales, Usuario} from '../models';
import {CredencialesRepository} from '../repositories';
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
    private encriptDecryptService: EncriptDecryptService
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
    let decoded: token = jsonwebtoken.verify(token, keys.JWT_SECRET_KEY);
    console.log(decoded);

    if (decoded)
      return decoded;
    else
      throw new HttpErrors[401]("Token invalido");
  }

  async IdentifyToken(username: string, password: string): Promise<Credenciales | false> {
    let user = await this.userService.ExistUser(username);
    if (user) {
      let cryptPass = this.encriptDecryptService.Encrypt(password);
      if (user.passwordHash == cryptPass) {
        return user;
      }
    }
    return false;
  }

  async ResetPassword(identificador: string, newpassword: string): Promise<string | false> {
    let user = await this.userService.ExistUser(identificador);
    if (user) {
      newpassword = this.encriptDecryptService.Encrypt(newpassword);
      user.passwordHash = newpassword;
      this.credencialesRepository.replaceById(user.id, user);
      return newpassword;
    }
    return false;
  }

}


