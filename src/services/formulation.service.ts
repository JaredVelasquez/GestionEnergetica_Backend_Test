import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {GenerateInvoice} from '../core/interfaces/models/invoice-generete.interface';
import {viewOf} from '../core/library/views.library';
import {FacturaManualRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class FormulationService {
  constructor(
    @repository(FacturaManualRepository)
    private facturaManualRepository: FacturaManualRepository,
  ) { }

  async searchValidInvoice(generateInvoice: GenerateInvoice) {
    let facturaEEHVigente;
    let facturaManualExist = await this.facturaManualRepository.find();

    for (let i = 0; i < facturaManualExist.length; i++) {
      if (facturaManualExist[i].fechaFinal <= Date.now().toString()) {
        facturaEEHVigente = facturaManualExist[i];
      }
    }
    console.log(facturaManualExist);


    return facturaEEHVigente;

  }

  async getIONDATA(generateInvoice: GenerateInvoice) {

    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_IONDATA} where TimestampUTC between '${generateInvoice.fechaInicial}' and '${generateInvoice.fechaFinal}'`,
    );
  }

}
