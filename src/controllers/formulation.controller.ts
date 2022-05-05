// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody, response} from '@loopback/rest';
import {GenerateInvoice} from '../core/interfaces/models/invoice-generete.interface';
import {FacturaManualRepository} from '../repositories';
import {FormulationService} from '../services';

// import {inject} from '@loopback/core';


export class FormulationController {
  constructor(
    @repository(FacturaManualRepository)
    private facturaManualRepository: FacturaManualRepository,
    @service(FormulationService)
    private formulationService: FormulationService,

  ) { }

  @post('/generate-invoice')
  @response(200, {
    description: 'Usuario model instance',
  })
  async RegisterUser(
    @requestBody() generateInvoice: GenerateInvoice
  ): Promise<any> {
    await this.formulationService.generateInvoices(generateInvoice);
    return true;
  }

}
