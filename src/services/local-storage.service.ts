import {BindingScope, injectable, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {AuthService} from '.';

const localStorage = require('local-storage');

@injectable({scope: BindingScope.TRANSIENT})
export class LocalStorage {
  constructor(
    @service(AuthService)
    private authService: AuthService
  ) {

  }

  SaveToken(token: string, identificator: string) {
    if (!identificator)
      throw new HttpErrors[401]("No existe identificador en la solicitud");

    const sessionToken = localStorage.get(identificator);
    if (!sessionToken) {
      localStorage.remove(identificator);
    } else
      localStorage.set("identificator", "token");
    console.log(localStorage.get("identificator"));

  }

  CheckToken(token: string, identificator: string) {
    if (!identificator)
      throw new HttpErrors[401]("No existe identificador en la solicitud");

    const sessionToken = localStorage.get(identificator + "");
    if (!sessionToken)
      throw new HttpErrors[401]("No tiene una sesion iniciada");

    const decodedToken = this.authService.VerifyToken(sessionToken);

    if (decodedToken.exp > Date.now()) {
      return true
    }
    return false;
  }

  DeleteSessionToken(token: string) {

  }
}
