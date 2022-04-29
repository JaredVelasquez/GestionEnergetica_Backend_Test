// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody, response} from '@loopback/rest';
import {GenerateInvoice} from '../core/interfaces/models/invoice-generete.interface';
import {viewOf} from '../core/library/views.library';
import {DataLog2Repository, FacturaManualRepository} from '../repositories';
import {FormulationService} from '../services';

// import {inject} from '@loopback/core';


export class FormulationController {
  constructor(
    @repository(FacturaManualRepository)
    private FacturaManualRepository: FacturaManualRepository,
    @repository(DataLog2Repository)
    private dataLog2Repository: DataLog2Repository,
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
    let facturaEEHVigente = this.formulationService.searchValidInvoice(generateInvoice);

    if (!facturaEEHVigente)
      console.log("No se encontro una factura vigente");

    let dataLog2 = await this.dataLog2Repository.dataSource.execute(
      `${viewOf.GET_IONDATA} where TimestampUTC between ${generateInvoice.fechaInicial} and ${generateInvoice.fechaFinal}`,
    );
    console.log(dataLog2);

    return true;
  }


}
