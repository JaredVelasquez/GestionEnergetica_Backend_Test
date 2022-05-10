import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {GenerateInvoice} from '../core/interfaces/models/invoice-generete.interface';
import {viewOf} from '../core/library/views.library';
import {FacturaManualRepository, MedidorRepository, MedidorVirtualRepository, RollOverRepository} from '../repositories';
export interface Medidor {
  sourceName: string,
  totalLecturaActiva: number,
  totalLecturaReactiva: number,
  quantityID: number
}

export interface ION_Data {
  sourceID: number,
  TimestampUTC: string,
  sourceName: string,
  quantityID: number,
  quantityName: string,
  Value: number,
  dataLog2ID: number,
  Fecha: string
}

@injectable({scope: BindingScope.TRANSIENT})
export class FormulationService {
  constructor(
    @repository(FacturaManualRepository)
    private facturaManualRepository: FacturaManualRepository,
    @repository(MedidorRepository)
    private medidorRepository: MedidorRepository,
    @repository(MedidorVirtualRepository)
    private medidorVirtualRepository: MedidorVirtualRepository,
    @repository(RollOverRepository)
    private rollOverRepository: RollOverRepository,
  ) { }

  async generateInvoices(generateInvoice: GenerateInvoice) {
    let lecturasEnergiaActiva: ION_Data[] = [], lecturasEnergiaReactiva: ION_Data[] = [];
    let historicoMedidorConsumo: Array<Medidor> = [];
    let facturasGeneradas: Array<any> = [];
    let cargosFacturaEEHVigente: [] = [];
    let consumoEEH = ['FC.FC_MM_001', 'FC.FC_MM_002', 'FC.FC_MM_003', 'FC.FC_MM_004', 'FC.FC_MM_005', 'FC.FC_MM_010', 'FC.FC_MM_011', 'FC.FC_MM_012', 'FC.FC_MM_013', 'FC.FC_MM_014'];
    let consumoSolar = ['FC.FC_MM_006', 'FC.FC_MM_007', 'FC.FC_MM_008', 'FC.FC_MM_009'];
    let frontera = 0;
    let EnergiaReactiva = 91, EnergiaActiva = 129;
    let FS = 0, EAC = 0, ESG = 0, EXR = 0, ECR = 0;
    let CEF = 0, PBE = 0, EA = 0;
    let CEC = 0, CEP = 0, PCF = 0;
    let CargoX = 0, TotalCargosY = 0;
    let RC = 0, FP = 0, ER = 0, PCFR = 0, EAPFR = 0;
    let PT = 0, TFPE = 0, PI = 0, ETCU = 0, ETO = 0;

    let facturaEEHVigente = await this.searchValidInvoice(generateInvoice);

    if (!facturaEEHVigente)
      console.log("No se encontro una factura vigente");

    lecturasEnergiaActiva = await this.getIONDATA(generateInvoice, EnergiaActiva);
    lecturasEnergiaReactiva = await this.getIONDATA(generateInvoice, EnergiaReactiva);
    console.log(lecturasEnergiaReactiva);

    for (let i = 0; i < consumoEEH.length; i++) {
      for (let j = 0; j < lecturasEnergiaActiva.length; j += 2) {
        let isRollover = false;
        let auxActiva = lecturasEnergiaActiva[j + 1].Value, antesDeRolloverActiva = 0, antesDeRolloverReactiva = 0;
        let auxReactiva = lecturasEnergiaReactiva[j + 1].Value;

        if (lecturasEnergiaActiva[j + 1].Value < lecturasEnergiaActiva[j].Value) {
          isRollover = true;
        }
        if (lecturasEnergiaActiva[j].sourceName === consumoEEH[i] && lecturasEnergiaActiva[j].sourceName === consumoEEH[i]) {
          if (isRollover)
            historicoMedidorConsumo.push(
              {
                sourceName: lecturasEnergiaActiva[j].sourceName,
                quantityID: lecturasEnergiaActiva[0].quantityID,
                totalLecturaActiva: lecturasEnergiaActiva[j + 1].Value,
                totalLecturaReactiva: lecturasEnergiaReactiva[j + 1].Value
              }
            );
          else
            historicoMedidorConsumo.push(
              {
                sourceName: lecturasEnergiaActiva[j].sourceName,
                quantityID: lecturasEnergiaActiva[0].quantityID,
                totalLecturaActiva: lecturasEnergiaActiva[j + 1].Value - lecturasEnergiaActiva[j].Value,
                totalLecturaReactiva: lecturasEnergiaReactiva[j + 1].Value - lecturasEnergiaReactiva[j].Value
              }
            );
        }


        lecturasEnergiaActiva[j + 1].Value = auxActiva;
        lecturasEnergiaReactiva[j + 1].Value = auxReactiva;

      }
      //
    }
    console.log(lecturasEnergiaActiva[24]);
    console.log(lecturasEnergiaActiva[25]);
    console.log(historicoMedidorConsumo);


    ECR = 200000;
    ESG = 300000;
    EXR = 20000;
    EAC = ESG - EXR;
    FS = EAC / (ECR + EAC);
    PBE = 4.40;
    EA = 80000;
    CEF = PBE * FS * EA;
    CEP = 90000;
    PCF = ((1 - FS) * EA) / (ECR);
    CEC = CEP * PCF;
    TotalCargosY = 6000000;
    CargoX = TotalCargosY * PCF;
    ER = 10000;
    FP = EA / Math.sqrt((EA) ^ 2 + (ER) ^ 2);
    if (FP < 0.9) {
      EAPFR = 14000;
      PCFR = EA / EAPFR;
    } else
      PCFR = 0;

    RC = FP * PCFR;
    ETCU = EA;
    ETO = ECR + EAC;
    PI = 1 - (ETCU / ETO);
    TFPE = 2000000;
    PT = TFPE * PI * PCF;

    return historicoMedidorConsumo;
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
    console.log(generateInvoice);
    console.log(quantityID);


    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_IONDATA} where (TimestampUTC = dateadd(hour,6,'${generateInvoice.fechaInicial}') or TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaFinal}')) and quantityID = ${quantityID} -- and sourceName = 'FC.FC_MM_013'`,
    );

  }

  async identifyRollOvers(lecturasEnergiaActivaFinal: ION_Data, lecturasEnergiaActivaInicial: ION_Data, lecturasEnergiaReactivaInicial: ION_Data, lecturasEnergiaReactivaFinal: ION_Data) {
    let isRollover = false;
    let auxActiva = lecturasEnergiaActivaFinal.Value, antesDeRolloverActiva = 0, antesDeRolloverReactiva = 0;
    let auxReactiva = lecturasEnergiaReactivaFinal.Value;

    let medidorIdentificado = await this.medidorRepository.findOne({where: {sourceId: lecturasEnergiaActivaInicial.sourceID}});
    let rollOver = await this.rollOverRepository.find({where: {medidorId: medidorIdentificado?.id}});


    if (!rollOver)
      console.log("No existen rollovers");

    if (rollOver) {
      for (let c = 0; c < rollOver.length; c++) {

        if (rollOver[c].energia === true && rollOver[c].estado === true) {
          if (Date.parse(rollOver[c].fechaInicial) <= Date.parse(lecturasEnergiaActivaFinal.Fecha) && Date.parse(rollOver[c].fechaInicial) >= Date.parse(lecturasEnergiaActivaInicial.Fecha) && medidorIdentificado?.sourceId === lecturasEnergiaActivaInicial.sourceID) {
            lecturasEnergiaActivaFinal.Value += rollOver[c].lecturaAnterior;
            antesDeRolloverActiva = rollOver[c].lecturaAnterior;
            isRollover = true;
          }
        } else if (rollOver[c].energia === false && rollOver[c].estado === true) {
          if (Date.parse(rollOver[c].fechaInicial) <= Date.parse(lecturasEnergiaReactivaInicial.Fecha) && Date.parse(rollOver[c].fechaInicial) >= Date.parse(lecturasEnergiaReactivaInicial.Fecha) && medidorIdentificado?.sourceId === lecturasEnergiaReactivaInicial.sourceID) {
            lecturasEnergiaReactivaFinal.Value += rollOver[c].lecturaAnterior;
            antesDeRolloverReactiva = rollOver[c].lecturaAnterior;
            isRollover = true;
          }

        } else
          isRollover = false;
      }

    }

    return {
      anteriorRollOverActiva: antesDeRolloverActiva,
      anteriorRollOverReactiva: antesDeRolloverReactiva,
      isRollover: isRollover,

    }


  }
}
