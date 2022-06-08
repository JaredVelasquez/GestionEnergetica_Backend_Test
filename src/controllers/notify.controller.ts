import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {CodigoVerificacionRepository, CredencialesRepository} from '../repositories';
import {NotifyService} from '../services';
var shortid = require('shortid-36');

export class NotifyController {
  constructor(
    @service()
    private notify: NotifyService,
    @repository(CredencialesRepository)
    private credentialsRepository: CredencialesRepository,
    @repository(CodigoVerificacionRepository)
    private codigoVerificacionRepository: CodigoVerificacionRepository
  ) { }



  @post('/send-email')
  async ParamtersTable(
    @requestBody() identi: {identificator: string},
  ): Promise<any> {
    let userExist = await this.credentialsRepository.findOne({where: {email: identi.identificator}});
    if (!userExist?.correo) {
      userExist = await this.credentialsRepository.findOne({where: {username: identi.identificator}});
    }

    if (!userExist?.correo) {
      return {error: "El usuario no esta registrado"};

    }

    let verificationCode: string = shortid.generate();
    let expTIME = new Date((Date.now() + (1000 * 120))).toISOString();

    let bodyCode = {userId: userExist.id, codigo: verificationCode, exp: expTIME, }

    await this.codigoVerificacionRepository.create(bodyCode);
    let resultado = await this.notify.EmailNotification(userExist.correo, 'Codigo de verificación', `Su codigo de verificacion es : ${verificationCode}`);
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
