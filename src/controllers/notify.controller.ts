import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {CodigoVerificacionRepository, CredencialesRepository} from '../repositories';
import {JWTService, NotifyService} from '../services';
var shortid = require('shortid-36');

@authenticate.skip()
export class NotifyController {
  constructor(
    @service()
    private notify: NotifyService,
    @service(JWTService)
    private jwt: JWTService,
    @repository(CredencialesRepository)
    private credentialsRepository: CredencialesRepository,
    @repository(CodigoVerificacionRepository)
    private codigoVerificacionRepository: CodigoVerificacionRepository
  ) { }



  @post('/send-email')
  async ParamtersTable(
    @requestBody() identi: {identificator: string, subject: string, text: string, atachment?: any, option: number},
  ): Promise<any> {
    let userExist
    console.log(identi);

    if (identi.option == 1) {
      userExist = await this.credentialsRepository.findOne({where: {email: identi.identificator}});
      if (!userExist?.correo) {
        userExist = await this.credentialsRepository.findOne({where: {username: identi.identificator}});
      }

      if (!userExist?.correo) {
        return {error: "El usuario no esta registrado"};

      }
      console.log(userExist);

      let verificationCode: string = await this.jwt.generateCode(userExist);
      await this.notify.EmailNotification(userExist.correo, `${identi.subject}`, `${identi.text} ${verificationCode}`);

    }

    if (identi.option == 2) {
      await this.notify.EmailNotification(identi.identificator, `${identi.subject}`, `${identi.text}`, identi.atachment);

    }
    if (identi.option == 3) {
      await this.notify.EmailNotification(identi.identificator, `${identi.subject}`, `${identi.text}`);

    }
    return true;
  }


  @post('/verify-code')
  async verifyCode(
    @requestBody() identi: {code: string},
  ): Promise<any> {
    let CodeExist = await this.codigoVerificacionRepository.findOne({where: {codigo: identi.code}});

    if (!CodeExist) {
      return {error: 'Codigo no registrado'};
    }

    if (Date.parse(CodeExist.exp) < Date.now()) {
      return {error: 'Codigo expirado'};
    }

    if (CodeExist.codigo != identi.code) {
      return {error: 'Codigo no coincide'};
    }

    return CodeExist.userId;
  }

}
