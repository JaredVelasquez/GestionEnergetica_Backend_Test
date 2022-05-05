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

  async generateInvoices(generateInvoice: GenerateInvoice) {
    let consumoSolar = ['FC.FC_MM_001', 'FC.FC_MM_002', 'FC.FC_MM_003', 'FC.FC_MM_004', 'FC.FC_MM_005', 'FC.FC_MM_010', 'FC.FC_MM_011', 'FC.FC_MM_012', 'FC.FC_MM_013', 'FC.FC_MM_014'];
    let consumoEEH = ['FC.FC_MM_006', 'FC.FC_MM_007', 'FC.FC_MM_008', 'FC.FC_MM_009'];
    let EnergiaReactiva = 91, EnergiaActiva = 129, FS;
    let contador = 0;
    let facturaEEHVigente = await this.searchValidInvoice(generateInvoice);

    if (!facturaEEHVigente)
      console.log("No se encontro una factura vigente");

    let lecturasEnergiaActiva = await this.getIONDATA(generateInvoice, EnergiaActiva);
    let lecturasEnergiaReactiva = await this.getIONDATA(generateInvoice, EnergiaReactiva);

    while (contador < consumoSolar.length) {
      for (let i = 0; i < lecturasEnergiaActiva.length; i++) {
        if (lecturasEnergiaActiva[i].sourceName === consumoSolar[contador]) {
          FS += lecturasEnergiaActiva[i].Value;
        }
      }
    }

    console.log(lecturasEnergiaActiva[0]);
    console.log(lecturasEnergiaActiva[lecturasEnergiaActiva.length - 1]);
    let energiaReactivaMensualConsumidaKWh = ((lecturasEnergiaActiva[lecturasEnergiaActiva.length - 1]).Value - lecturasEnergiaActiva[0].Value);

    console.log(energiaReactivaMensualConsumidaKWh);

    console.log(lecturasEnergiaReactiva[lecturasEnergiaReactiva.length - 1]);


    return lecturasEnergiaActiva;
  }

  async searchValidInvoice(generateInvoice: GenerateInvoice) {
    let facturaEEHVigente = await this.getFacturaEHH(generateInvoice);

    return facturaEEHVigente;
  }

  async getFacturaEHH(generateInvoice: GenerateInvoice) {
    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_EHH_INVOICE} where fechaFinal between '${generateInvoice.fechaInicial}' and '${generateInvoice.fechaFinal}'`,
    );

  }

  async getSource() {
    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_SOURCE}`,
    );


  }

  async getIONDATA(generateInvoice: GenerateInvoice, quantityID: number) {

    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_IONDATA} where TimestampUTC between dateadd(hour,6,'${generateInvoice.fechaInicial}') and dateadd(hour,6,'${generateInvoice.fechaFinal}') and quantityID = ${quantityID}`,
    );

  }

}
