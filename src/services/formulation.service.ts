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

export interface CargosFacturaEEH {
  id: number,
  nombre: string,
  valor: number,
  estado: boolean
}

export interface LecturasPorContrato {

  contrato: {
    contratoId: number,
    contratoMedId: number,
    contratoCodigo: string,
    fechaInicial: string,
    fechaFinal: string,

  },
  cargo?:
  [
    {
      nombre: string,
      valorAjustado: number
    }
  ],
  medidor: [
    {
      sourceID: number,
      sourceName: string,
      LecturaActiva: number,
      LecturaReactiva: number,
      CEF: number,
      PCF: number,
      FP: number,
      PCFR: number

    }
  ],
  totalLecturaActivaAjustada: number,
  totalLecturaReactivaAjustada: number,
  CEFTotal: number,
  PCFTotal: number,


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
    let consumoEEH = ['FC.FC_MM_005', 'FC.FC_MM_006', 'FC.FC_MM_007', 'FC.FC_MM_008', 'FC.FC_MM_009', 'FC.FC_MM_010', 'FC.FC_MM_011', 'FC.FC_MM_012', 'FC.FC_MM_013', 'FC.FC_MM_014'];
    let consumoSolar = ['FC.FC_MM_001', 'FC.FC_MM_002', 'FC.FC_MM_003', 'FC.FC_MM_004'];
    let tarifaSolar = 0, tarifaEnergiaExterna = 13;
    let MedidorFronteraSourceID = 0;
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

    let facturaEEHVigente = await this.searchValidInvoice(generateInvoice);
    console.log(facturaEEHVigente);

    if (!facturaEEHVigente)
      return "No se encontro una factura vigente";

    lecturasEnergiaActiva = await this.getAllMetersIONDATA(generateInvoice, EnergiaActiva);
    lecturasEnergiaReactiva = await this.getAllMetersIONDATA(generateInvoice, EnergiaReactiva);
    let contratosVigentes = await this.metersOnContract(hoy);

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
    console.log(historicoMedidorConsumo);

    ESG = await this.SumaEnergiaDeMedidores(consumoSolar, historicoMedidorConsumo);
    console.log('Total energia solar generada : ' + ESG);
    ECR = await this.SumaEnergiaDeMedidores(consumoEEH, historicoMedidorConsumo);
    console.log('Total energia externa consumida : ' + ECR);
    ETCU = await this.LecturasMedidorFrontera(MedidorFronteraSourceID, historicoMedidorConsumo, generateInvoice);
    console.log('Medidor Frontera : ' + ETCU);
    EXR = 11314.20;
    console.log('Total energia fotovoltaica exportada : ' + EXR);
    EAC = ESG - EXR;
    console.log('Total energia fotovoltaica utilizada : ' + EAC);
    FS = EAC / (ECR + EAC);
    console.log('Porcenaje de consumo solar : ' + FS);
    PBE = await this.ObtenerTarifaVigente(1, generateInvoice, tarifaEnergiaExterna);
    console.log('Tarifa : ' + PBE);
    ETO = EAC + ECR;
    console.log('Energía total obtenida : ' + ETO);

    let lecturasConCEF = await this.CargoPorEnergiaFotovoltaicaPorMedidor(lecturasMedidoresPorContrato, PBE, FS);
    let listadoCargos = await this.ObetenerCargosPorFactura(facturaEEHVigente[0].id);
    lecturasMedidoresPorContrato = await this.ProporcionClienteFinal(lecturasMedidoresPorContrato, FS, ECR);
    lecturasMedidoresPorContrato = await this.DistribucionCargosPorCliente(listadoCargos, lecturasMedidoresPorContrato);
    lecturasMedidoresPorContrato = await this.FactorDePotencia(lecturasMedidoresPorContrato);
    lecturasMedidoresPorContrato = await this.PorcentajePenalizacionPorFP(lecturasMedidoresPorContrato);
    PI = 1 - (ETCU / ETO);
    console.log('Fracción de Perdidas Internas totales : ' + PI);

    return lecturasMedidoresPorContrato;
  }

  async searchValidInvoice(generateInvoice: GenerateInvoice) {
    let facturaEEHVigente = await this.getFacturaEHH(generateInvoice);

    return facturaEEHVigente;
  }

  async getFacturaEHH(generateInvoice: GenerateInvoice) {
    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_EHH_INVOICE} where fechaInicial = '${generateInvoice.fechaInicial}' and fechaFinal = '${generateInvoice.fechaFinal}'`,
    );

  }

  async getSource() {
    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_SOURCE}`,
    );


  }

  async getIONDATA(generateInvoice: GenerateInvoice, quantityID: number) {
    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_IONDATA} where (TimestampUTC = dateadd(hour,6,'${generateInvoice.fechaInicial}') or TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaFinal}')) and quantityID = ${quantityID} and sourceID != 27 ORDER BY sourceName ASC`,
    );
  }

  async getAllMetersIONDATA(generateInvoice: GenerateInvoice, quantityID: number) {


    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_ALL_IONDATA} where (TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaInicial}') or TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaFinal}')) and quantityID = ${quantityID} and sourceID != 27 ORDER BY sourceName ASC`,
    );

  }

  async ObtenerTarifaVigente(estado: number, data: GenerateInvoice, tipoCargoId: number): Promise<number> {
    let Tarifa = await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_PT_DETAIL} WHERE estado = ${estado} and (fechaInicio >= '${data.fechaInicial}' and fechaFinal >= '${data.fechaFinal}') and tipoCargoId = ${tipoCargoId}`,
    );

    return Tarifa[0].valor ? Tarifa[0].valor : 0;
  }

  async GenerarLecturaPromediadaTemporal() {

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

  async ObetenerLecturasManualesPorFecha(fechaInicial: string, fechaFinal: string) {
    let lecturasManuales = this.medidorRepository.dataSource.execute(
      `${viewOf.GET_MANUAL_REGISTERS_FOR_DATE} where sourceId = 0 and (fecha = '${fechaInicial}' or fecha = '${fechaFinal}')`,
    );

    return lecturasManuales;
  }

  async ObetenerCargosPorFactura(facturaEEHId: number) {
    let listadoCargos = this.medidorRepository.dataSource.execute(
      `${viewOf.GET_EEHINVOICE_CHARGUES} where id = ${facturaEEHId} and estado = 1`,
    );

    return listadoCargos;

  }


  async identifyMetersOnContract(lecturasMedidores: MedidorSelect[], listadoContratosMedidor: ContractMeter[]) {
    let LecturasResultantes: LecturasPorContrato[] = [];
    let isDetected = false;

    for (let i = 0; i < lecturasMedidores.length; i++) {
      for (let j = 0; j < listadoContratosMedidor.length; j++) {
        isDetected = false;
        if (lecturasMedidores[i].sourceId === listadoContratosMedidor[j].sourceId) {
          if (LecturasResultantes.length > 0) {
            for (let c = 0; c < LecturasResultantes.length; c++) {
              if (listadoContratosMedidor[j].codigoContrato === LecturasResultantes[c].contrato.contratoCodigo) {
                LecturasResultantes[c].medidor.push({
                  sourceID: lecturasMedidores[i].sourceId,
                  sourceName: lecturasMedidores[i].sourceName,
                  LecturaActiva: lecturasMedidores[i].totalLecturaActiva,
                  LecturaReactiva: lecturasMedidores[i].totalLecturaReactiva,
                  CEF: 0,
                  PCF: 0,
                  FP: 0,
                  PCFR: 0,
                });
                LecturasResultantes[c].totalLecturaActivaAjustada += lecturasMedidores[i].totalLecturaActiva;
                LecturasResultantes[c].totalLecturaReactivaAjustada += lecturasMedidores[i].totalLecturaReactiva;
                isDetected = true
              }
            }
          }

          if (!isDetected) {
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
                LecturaReactiva: lecturasMedidores[i].totalLecturaReactiva,
                CEF: 0,
                PCF: 0,
                FP: 0,
                PCFR: 0,
              }],
              totalLecturaActivaAjustada: lecturasMedidores[i].totalLecturaActiva,
              totalLecturaReactivaAjustada: lecturasMedidores[i].totalLecturaReactiva,
              CEFTotal: 0,
              PCFTotal: 0,
            });

          }
        }
      }
    }

    console.log(LecturasResultantes);

    return LecturasResultantes;
  }

  async SumaEnergiaDeMedidores(listaMedidores: string[], LecturasPorMedidor: MedidorSelect[]) {
    let TotalEnergia = 0;

    if (LecturasPorMedidor.length > 0)
      for (let i = 0; i < listaMedidores.length; i++) {
        for (let j = 0; j < LecturasPorMedidor.length; j++) {
          if (listaMedidores[i] === LecturasPorMedidor[j].sourceName) {
            TotalEnergia += LecturasPorMedidor[j].totalLecturaActiva;
          }
        }
      }

    return TotalEnergia;
  }

  async LecturasMedidorFrontera(MedidorFronteraSourceID: number, LecturasPorMedidor: MedidorSelect[], data: GenerateInvoice) {
    let LecturasFrontera = 0;
    for (let i = 0; i < LecturasPorMedidor.length; i++) {
      if (LecturasPorMedidor[i].sourceId === MedidorFronteraSourceID) {
        LecturasFrontera += LecturasPorMedidor[i].totalLecturaActiva;
      }
    }
    if (LecturasFrontera == 0) {
      let lecturasManuales = await this.ObetenerLecturasManualesPorFecha(data.fechaInicial, data.fechaFinal);
      if (lecturasManuales.length > 1) {
        LecturasFrontera = lecturasManuales[1].valor - lecturasManuales[0].valor;
      }
    }
    return LecturasFrontera;
  }

  async CargoPorEnergiaFotovoltaicaPorMedidor(LecturasPorMedidor: LecturasPorContrato[], PBE: number, FS: number) {
    for (let i = 0; i < LecturasPorMedidor.length; i++) {
      for (let j = 0; j < LecturasPorMedidor[i].medidor.length; j++) {
        LecturasPorMedidor[i].medidor[j].CEF = PBE * FS * LecturasPorMedidor[i].medidor[j].LecturaActiva;
        LecturasPorMedidor[i].CEFTotal += LecturasPorMedidor[i].medidor[j].CEF;
      }
    }
    return LecturasPorMedidor;

  }

  async ProporcionClienteFinal(LecturasPorMedidor: LecturasPorContrato[], FS: number, ECR: number) {
    for (let i = 0; i < LecturasPorMedidor.length; i++) {
      for (let j = 0; j < LecturasPorMedidor[i].medidor.length; j++) {
        LecturasPorMedidor[i].medidor[j].PCF = ((1 - FS) * LecturasPorMedidor[i].medidor[j].LecturaActiva) / ECR;
        LecturasPorMedidor[i].PCFTotal += LecturasPorMedidor[i].medidor[j].PCF;
      }
    }
    return LecturasPorMedidor;

  }

  async DistribucionCargosPorCliente(listadoCargos: CargosFacturaEEH[], listadoContratosMedidor: LecturasPorContrato[]) {
    for (let i = 0; i < listadoContratosMedidor.length; i++) {
      for (let j = 0; j < listadoCargos.length; j++) {
        if (!listadoContratosMedidor[i].cargo?.length) {
          listadoContratosMedidor[i].cargo = [{
            nombre: listadoCargos[j].nombre,
            valorAjustado: listadoCargos[j].valor * listadoContratosMedidor[i].PCFTotal
          }];
        } else {
          listadoContratosMedidor[i].cargo?.push({
            nombre: listadoCargos[j].nombre,
            valorAjustado: listadoCargos[j].valor * listadoContratosMedidor[i].PCFTotal
          });

        }
      }
    }
    return listadoContratosMedidor;
  }

  async FactorDePotencia(listadoContratosMedidor: LecturasPorContrato[]) {
    for (let i = 0; i < listadoContratosMedidor.length; i++) {
      for (let j = 0; j < listadoContratosMedidor[i].medidor.length; j++) {
        listadoContratosMedidor[i].medidor[j].FP = (listadoContratosMedidor[i].medidor[j].LecturaReactiva) / ((Math.sqrt(listadoContratosMedidor[i].medidor[j].LecturaActiva)) ^ 2 + (Math.sqrt(listadoContratosMedidor[i].medidor[j].LecturaReactiva)) ^ 2)

      }

    }
    return listadoContratosMedidor;
  }

  async PorcentajePenalizacionPorFP(listadoContratosMedidor: LecturasPorContrato[]) {
    let EAPFR = 0;
    for (let i = 0; i < listadoContratosMedidor.length; i++) {
      for (let j = 0; j < listadoContratosMedidor[i].medidor.length; j++) {
        if (listadoContratosMedidor[i].medidor[j].FP < 0.90) {
          EAPFR += listadoContratosMedidor[i].medidor[j].LecturaActiva;
        }
      }

    }

    for (let i = 0; i < listadoContratosMedidor.length; i++) {
      for (let j = 0; j < listadoContratosMedidor[i].medidor.length; j++) {
        if (listadoContratosMedidor[i].medidor[j].FP < 0.90) {
          listadoContratosMedidor[i].medidor[j].PCFR = listadoContratosMedidor[i].medidor[j].LecturaActiva / EAPFR;
        }
        else
          listadoContratosMedidor[i].medidor[j].PCFR = 0;
      }

    }

    return listadoContratosMedidor;
  }


}



