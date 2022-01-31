import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {keys} from "../env/interfaces/Servicekeys.interface";
import {Usercredentials} from '../models';
import {UsercredentialsRepository} from './../repositories/usercredentials.repository';
import {EncriptDecryptService} from './encript-decrypt.service';
//import {LoginService} from "./login.service";
const jsonwebtoken = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {

  constructor(
    @repository(UsercredentialsRepository)
    private usercredentialsRepository: UsercredentialsRepository,
    // @service(LoginService)
    // private loginService: LoginService,
    @service(EncriptDecryptService)
    private encriptDecryptService: EncriptDecryptService
  ) {
  }


  createToken(user: Usercredentials) {
    try {
      let token = jsonwebtoken.sign({
        exp: keys.TOKEN_EXPIRATION_TIME,
        data: {
          UserID: user.id,
          UserNAME: user.username,
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

  // async IdentifyToken(username: string, password: string): Promise<Usercredentials | false> {
  //   let user = await this.loginService.ExistUser(username);
  //   if (user) {
  //     let cryptPass = this.encriptDecryptService.Encrypt(password);
  //     if (user.passwordHash == cryptPass) {
  //       return user;
  //     }
  //   }
  //   return false;
  // }

  // async ResetPassword(identificador: string, newpassword: string): Promise<string | false> {
  //   let user = await this.loginService.ExistUser(identificador);
  //   if (user) {
  //     newpassword = this.encriptDecryptService.Encrypt(newpassword);
  //     user.passwordHash = newpassword;
  //     this.usercredentialsRepository.replaceById(user.id, user);
  //     return newpassword;
  //   }
  //   return false;
  // }

}


