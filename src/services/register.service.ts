import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserService} from '.';
import {RegisterUserInterface} from '../core/interfaces/models/RegisterUser.interface';
import {CredencialesRepository} from '../repositories';
import {ActoresRepository} from './../repositories/actores.repository';
import {UsuarioRepository} from './../repositories/usuario.repository';
import {EncriptDecryptService} from './encript-decrypt.service';

@injectable({scope: BindingScope.TRANSIENT})
export class RegisterService {
  userService: UserService;
  constructor(
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
    @repository(ActoresRepository)
    private actoresRepository: ActoresRepository,
    @repository(CredencialesRepository)
    private credencialesRepository: CredencialesRepository,
    @service(EncriptDecryptService)
    private encriptDecryptService: EncriptDecryptService
  ) { }

  async RegisterUser(registerUser: RegisterUserInterface): Promise<boolean | any> {
    let userExist = await this.credencialesRepository.findOne({where: {email: registerUser.email} || {username: registerUser.email}});

    if (userExist)
      throw new HttpErrors[401]("Estas correo o nombre de usuario ya esta registrado.");

    let estado = true;
    let modelActor: any = {
      codigo: registerUser.code,
      tipoActor: registerUser.userType,
    }
    let newActor = await this.actoresRepository.create(modelActor);
    console.log(newActor);
    if (!newActor)
      throw new HttpErrors[401]("No se pudo crear el actor");
    let modelUser: any = {
      actorId: newActor.id,
      rolid: registerUser.roleId,
      nombre: registerUser.firstName,
      apellido: registerUser.lastName,
      correo: registerUser.email,
      estado: estado
    }
    let newUser = await this.usuarioRepository.create(modelUser);
    console.log(newUser);
    if (!newUser)
      throw new HttpErrors[401]("No se pudo crear el Usuario");

    let newHash = this.encriptDecryptService.Encrypt(registerUser.password);

    if (!newHash)
      throw new HttpErrors[401]("No se pudo crear el Hash");

    let modelCredentials: any = {
      correo: registerUser.email,
      username: registerUser.username,
      hash: newHash
    }

    let newCredentials = await this.credencialesRepository.create(modelCredentials);
    console.log(newCredentials);

    return true;
  }


}
