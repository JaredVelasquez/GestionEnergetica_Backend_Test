import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {CredencialesRepository, UsuarioRepository} from '../repositories';
import {LoginInterface} from './../core/interfaces/models/Login.interface';
import {AuthService} from './auth.service';

@injectable({scope: BindingScope.TRANSIENT})
export class LoginService {

  constructor(
    @repository(CredencialesRepository)
    private credencialesRepository: CredencialesRepository,
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
    @service(AuthService)
    private authService: AuthService
  ) {
  }

  async Login(loginInterface: LoginInterface) {
    if (!loginInterface)
      throw new HttpErrors[401]("No puede mandar los campos del Login vacios.");
    let credentialExist = await this.credencialesRepository.findOne({where: {username: loginInterface.identificator} || {email: loginInterface.identificator}});
    if (!credentialExist)
      throw new HttpErrors[401]("Este usuario no esta registrado.");
    let user = await this.usuarioRepository.findOne({where: {correo: credentialExist.correo}})

    if (!user)
      throw new HttpErrors[401]("Usuario no encontrado.");

    let token = this.authService.createToken(credentialExist, user);

    if (!token)
      throw new HttpErrors[404]("El token no pudo ser creado");

    return token;
  }
}
