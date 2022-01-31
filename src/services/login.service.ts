// import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
// import {repository} from '@loopback/repository';
// import {HttpErrors} from '@loopback/rest';
// import {LoginInterface} from './../core/interfaces/models/Login.interface';
// import {UsercredentialsRepository} from './../repositories/usercredentials.repository';
// import {AuthService} from './auth.service';

// @injectable({scope: BindingScope.TRANSIENT})
// export class LoginService {

//   constructor(
//     @repository(UsercredentialsRepository)
//     private usercredentialsRepository: UsercredentialsRepository,
//     @service(AuthService)
//     private authService: AuthService
//   ) {
//   }

//   async Login(loginInterface: LoginInterface) {
//     console.log(loginInterface);

//     if (!loginInterface)
//       throw new HttpErrors[401]("No puede mandar los campos del Login vacios.");
//     let userExist = await this.usercredentialsRepository.findOne({where: {username: loginInterface.identificator} || {email: loginInterface.identificator}});
//     if (!userExist)
//       throw new HttpErrors[401]("Este usuario no esta registrado.");
//     console.log(userExist);

//     let token = this.authService.createToken(userExist);
//     console.log(token);

//     if (!token)
//       throw new HttpErrors[404]("El token no pudo ser creado");

//     return token;
//   }
//   async ExistUser(identificator: any) {
//     if (!identificator)
//       throw new HttpErrors[401]("No existe identificador");

//     let user = await this.usercredentialsRepository.findOne({where: {email: identificator}});

//     if (!user)
//       user = await this.usercredentialsRepository.findOne({where: {username: identificator}});
//     if (!user)
//       throw new HttpErrors[401]("Este usuario no existe");

//     return user;
//   }
// }
