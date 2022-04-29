import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {GenerateInvoice} from '../core/interfaces/models/invoice-generete.interface';
import {FacturaManualRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class FormulationService {
  constructor(
    @repository(FacturaManualRepository)
    private facturaManualRepository: FacturaManualRepository,
  ) { }

  searchValidInvoice(generateInvoice: GenerateInvoice) {
    let facturaManualExist = this.facturaManualRepository.find({where: {facturaInicial: generateInvoice.fechaInicial} && {fechaFinal: generateInvoice.fechaFinal}});

    console.log(facturaManualExist);

    return facturaManualExist;

  }

}
