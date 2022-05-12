import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {GenerateInvoice} from '../core/interfaces/models/invoice-generete.interface';
import {viewOf} from '../core/library/views.library';
import {TipoCargoFacturaManual} from '../models';
import {FacturaManualRepository, MedidorRepository, MedidorVirtualDetalleRepository, MedidorVirtualRepository, RollOverRepository} from '../repositories';
export interface MedidorSelect {
  sourceId: number
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

export interface ContractMeter {
  estado: boolean,
  codigoContrato: string,
  contratoMedidorId: number,
  nombreActor: string,
  actorId: number,
  codigoMedidor: string,
  medidorId: number,
  sourceId: number,
  sourceName: string,
  ptarifaValor: number,
  parametroId: number,
  tarifaId: number,
  contratoId: number,
  tipoContratoId: number,
  fechaInicial: string,
  fechaFinal: string,
  fechaCreacion: string,
  fechaVenc: string,
  observacion: string,
  zonaId: number
}

export interface LecturasPorContrato {
  contrato: {
    contratoId: number,
    contratoMedId: number,
    contratoCodigo: string,
    fechaInicial: string,
    fechaFinal: string,

  },
  medidor: [{
    sourceID: number,
    sourceName: string,
    LecturaActiva: number,
    LecturaReactiva: number
  }],
  totalLecturaActivaAjustada: number,
  totalLecturaReactivaAjustada: number,
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
    @repository(MedidorVirtualDetalleRepository)
    private medidorVirtualDetalleRepository: MedidorVirtualDetalleRepository,
  ) { }

  async generateInvoices(generateInvoice: GenerateInvoice) {
    let lecturasEnergiaActiva: ION_Data[] = [], lecturasEnergiaReactiva: ION_Data[] = [];
    let historicoMedidorConsumo: Array<MedidorSelect> = [];
    let procentajeCargosAsignados: TipoCargoFacturaManual[];
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
    let i = 0;
    let hoy = new Date().toISOString();
    let medidores = await this.getSource();

    console.log(medidores);

    let facturaEEHVigente = await this.searchValidInvoice(generateInvoice);

    if (!facturaEEHVigente)
      console.log("No se encontro una factura vigente");

    lecturasEnergiaActiva = await this.getAllMetersIONDATA(generateInvoice, EnergiaActiva);
    lecturasEnergiaReactiva = await this.getAllMetersIONDATA(generateInvoice, EnergiaReactiva);
    let contratosVigentes = await this.metersOnContract(hoy);
    console.log(contratosVigentes);

    for (let j = 0; j < lecturasEnergiaActiva.length; j += 2) {
      let auxActiva = lecturasEnergiaActiva[j + 1].Value;
      let auxReactiva = lecturasEnergiaReactiva[j + 1].Value;


      let resultadoRollOver = await this.identifyRollOvers(lecturasEnergiaActiva[j + 1], lecturasEnergiaActiva[j], lecturasEnergiaReactiva[j], lecturasEnergiaReactiva[j + 1]);
      let medidorVirtualAplicados = await this.aplyVirtualMeters(lecturasEnergiaActiva[j], resultadoRollOver.LecturaActivaFinal, resultadoRollOver.LecturaReactivaFinal);


      if (lecturasEnergiaActiva[j].sourceID === medidores[i].ID && lecturasEnergiaActiva[j].sourceID === medidores[i].ID && lecturasEnergiaReactiva[j].sourceID === medidores[i].ID) {
        historicoMedidorConsumo.push(
          {
            sourceId: lecturasEnergiaActiva[j].sourceID,
            sourceName: lecturasEnergiaActiva[j].sourceName,
            quantityID: lecturasEnergiaActiva[0].quantityID,
            totalLecturaActiva: medidorVirtualAplicados.LecturaActivaAjustada,
            totalLecturaReactiva: medidorVirtualAplicados.LecturaReactivaAjustada,
          }
        );
      }

      lecturasEnergiaActiva[j + 1].Value = auxActiva;
      lecturasEnergiaReactiva[j + 1].Value = auxReactiva;
      i++;
    }

    let lecturasMedidoresPorContrato = await this.identifyMetersOnContract(historicoMedidorConsumo, contratosVigentes);

    console.log(lecturasEnergiaActiva);

    for (let i = 0; i < lecturasEnergiaActiva.length; i += 2) {
      if (lecturasEnergiaActiva[i].sourceName === consumoSolar[i]) {
        ESG += lecturasEnergiaActiva[i].Value;
      }
    }

    console.log(ESG);




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
      `${viewOf.GET_IONDATA} where (TimestampUTC = dateadd(hour,6,'${generateInvoice.fechaInicial}') or TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaFinal}')) and quantityID = ${quantityID} ORDER BY sourceName ASC`,
    );
  }

  async getAllMetersIONDATA(generateInvoice: GenerateInvoice, quantityID: number) {


    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_ALL_IONDATA} where (TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaInicial}') or TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaFinal}')) and quantityID = ${quantityID} ORDER BY sourceName ASC`,
    );

  }

  async identifyRollOvers(lecturasEnergiaActivaFinal: ION_Data, lecturasEnergiaActivaInicial: ION_Data, lecturasEnergiaReactivaInicial: ION_Data, lecturasEnergiaReactivaFinal: ION_Data) {

    let medidorIdentificado = await this.medidorRepository.findOne({where: {sourceId: lecturasEnergiaActivaInicial.sourceID}});
    let rollOver = await this.rollOverRepository.find({where: {medidorId: medidorIdentificado?.id}});

    if (rollOver) {
      for (let c = 0; c < rollOver.length; c++) {

        if (rollOver[c].energia === true && rollOver[c].estado === true) {
          if (Date.parse(rollOver[c].fechaInicial) <= Date.parse(lecturasEnergiaActivaFinal.Fecha) && Date.parse(rollOver[c].fechaInicial) >= Date.parse(lecturasEnergiaActivaInicial.Fecha) && medidorIdentificado?.id === rollOver[c].medidorId) {
            lecturasEnergiaActivaFinal.Value += lecturasEnergiaActivaInicial.Value;
          }
        }

        if (rollOver[c].energia === false && rollOver[c].estado === true) {
          if (Date.parse(rollOver[c].fechaInicial) <= Date.parse(lecturasEnergiaReactivaFinal.Fecha) && Date.parse(rollOver[c].fechaInicial) >= Date.parse(lecturasEnergiaReactivaInicial.Fecha) && medidorIdentificado?.id === rollOver[c].medidorId) {
            console.log(lecturasEnergiaReactivaFinal.Value + ' + ' + lecturasEnergiaReactivaInicial.Value + ' = ');

            lecturasEnergiaReactivaFinal.Value += lecturasEnergiaReactivaInicial.Value;
          }

        }
      }

    }

    return {
      LecturaActivaFinal: lecturasEnergiaActivaFinal.Value - lecturasEnergiaActivaInicial.Value,
      LecturaReactivaFinal: lecturasEnergiaReactivaFinal.Value - lecturasEnergiaReactivaInicial.Value,

    }


  }

  async aplyVirtualMeters(lecturasEnergiaActivaFinal: ION_Data, lecturaEnergiaActivaFinal: number, lecturaEnergiaReactivaFinal: number) {
    let medidorIdentificado = await this.medidorRepository.findOne({where: {sourceId: lecturasEnergiaActivaFinal.sourceID}});
    let medidoresVirtualesRelacionados = await this.medidorVirtualDetalleRepository.find({where: {medidorId: medidorIdentificado?.id}});
    let LecturaActivaAjustada = lecturaEnergiaActivaFinal, LecturaReactivaAjustada = lecturaEnergiaReactivaFinal;
    let isAplicated = false;
    if (medidoresVirtualesRelacionados) {
      for (let i = 0; i < medidoresVirtualesRelacionados.length; i++) {
        let medidoresVirutalesIdentificados = await this.medidorVirtualRepository.findOne({where: {id: medidoresVirtualesRelacionados[i].vmedidorId}});

        if (medidoresVirutalesIdentificados?.operacion === false && medidoresVirtualesRelacionados[i].estado === true) {
          console.log(lecturaEnergiaReactivaFinal + ' - ' + (lecturaEnergiaReactivaFinal * medidoresVirutalesIdentificados.porcentaje) + ' = ' + (lecturaEnergiaReactivaFinal - (lecturaEnergiaReactivaFinal * medidoresVirutalesIdentificados.porcentaje)));

          LecturaActivaAjustada = lecturaEnergiaActivaFinal - (lecturaEnergiaActivaFinal * medidoresVirutalesIdentificados.porcentaje);
          LecturaReactivaAjustada = lecturaEnergiaReactivaFinal - (lecturaEnergiaReactivaFinal * medidoresVirutalesIdentificados.porcentaje);
        }

        if (medidoresVirutalesIdentificados?.operacion === true && medidoresVirtualesRelacionados[i].estado === true) {
          LecturaActivaAjustada = lecturaEnergiaActivaFinal + (lecturaEnergiaActivaFinal * medidoresVirutalesIdentificados.porcentaje);
          LecturaReactivaAjustada = lecturaEnergiaReactivaFinal + (lecturaEnergiaReactivaFinal * medidoresVirutalesIdentificados.porcentaje);
        }

        isAplicated = true;
      }
    }

    return {
      LecturaActivaAjustada: LecturaActivaAjustada,
      LecturaReactivaAjustada: LecturaReactivaAjustada,
      medidoresVirtualesAplicados: isAplicated
    }
  }

  async metersOnContract(today: string) {
    let contratosVigentes = this.medidorRepository.dataSource.execute(
      `${viewOf.GET_CMETERS} where estado = 1 and fechaCreacion < '${today}' and fechaVenc > '${today}'  and tipoContratoId = 3`,
    );

    return contratosVigentes;
  }


  async identifyMetersOnContract(lecturasMedidores: MedidorSelect[], listadoContratosMedidor: ContractMeter[]) {
    let LecturasResultantes: LecturasPorContrato[] = [];

    for (let i = 0; i < lecturasMedidores.length; i++) {
      for (let j = 0; j < listadoContratosMedidor.length; j++) {
        if (lecturasMedidores[i].sourceId === listadoContratosMedidor[j].sourceId) {
          if (LecturasResultantes.length > 0) {
            for (let c = 0; c < LecturasResultantes.length; c++) {
              if (listadoContratosMedidor[j].codigoContrato === LecturasResultantes[c].contrato.contratoCodigo) {
                LecturasResultantes[c].medidor.push({
                  sourceID: lecturasMedidores[i].sourceId,
                  sourceName: lecturasMedidores[i].sourceName,
                  LecturaActiva: lecturasMedidores[i].totalLecturaActiva,
                  LecturaReactiva: lecturasMedidores[i].totalLecturaReactiva
                });
                LecturasResultantes[c].totalLecturaActivaAjustada += lecturasMedidores[i].totalLecturaActiva;
                LecturasResultantes[c].totalLecturaReactivaAjustada += lecturasMedidores[i].totalLecturaReactiva;
              }
            }
          } else {
            LecturasResultantes.push({
              contrato: {
                contratoId: listadoContratosMedidor[j].contratoId,
                contratoMedId: listadoContratosMedidor[j].contratoMedidorId,
                contratoCodigo: listadoContratosMedidor[j].codigoContrato,
                fechaInicial: listadoContratosMedidor[j].fechaInicial,
                fechaFinal: listadoContratosMedidor[j].fechaFinal,
              },
              medidor: [{
                sourceID: lecturasMedidores[i].sourceId,
                sourceName: lecturasMedidores[i].sourceName,
                LecturaActiva: lecturasMedidores[i].totalLecturaActiva,
                LecturaReactiva: lecturasMedidores[i].totalLecturaReactiva
              }],
              totalLecturaActivaAjustada: lecturasMedidores[i].totalLecturaActiva,
              totalLecturaReactivaAjustada: lecturasMedidores[i].totalLecturaReactiva,
            });

          }
        }
      }
    }
    console.log(LecturasResultantes[0]);
  }

  async filterActiveMeters(listaMedidores: string[], listadoContratosMedidor: ContractMeter[]) {


  }
}



