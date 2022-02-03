import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, RedirectRoute, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {ParamsDictionary} from 'express-serve-static-core';
import parseBearerToken from 'parse-bearer-token';
import {ParsedQs} from 'qs';
import {token} from '../core/interfaces/models/token.interface';
import {Rol} from '../core/library/rol.library';
import {EstrategyService, JWTService} from '../services';


export class AdministradorStrategy implements AuthenticationStrategy {
  name: string = 'admin';

  constructor(
    @service(EstrategyService)
    public strategyService: EstrategyService,
    @service(JWTService)
    private jwtService: JWTService
  ) {

  }
  authenticate(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<UserProfile | RedirectRoute | undefined> {
    const token = parseBearerToken(request);
    if (!token) {
      throw new HttpErrors[401]("No existe un token en la solicitud.")
    }
    const decodedToken: token = this.jwtService.VerifyToken(token);
    const profileData = this.strategyService.autheticate(decodedToken, Rol.Administrator);

    return profileData;
  }
}
