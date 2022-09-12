import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {GenerateInvoice} from '../core/interfaces/models/invoice-generete.interface';
import {viewOf} from '../core/library/views.library';
import {FacturaManualRepository, MedidorRepository, MedidorVirtualDetalleRepository, MedidorVirtualRepository, RollOverRepository} from '../repositories';

export interface MedidorSelect {
  sourceId: number
  sourceName: string,
  descripcion?: string,
  totalLecturaActiva: number,
  totalLecturaReactiva: number,
  quantityID: number,
  lecturaActivaActual: number,
  lecturaActivaAnterior: number,
  lecturaReactivaActual: number,
  lecturaReactivaAnterior: number,
  lecturaActivaExportada: number,
  lecturaActivaExportadaActual: number,
  lecturaActivaExportadaAnterior: number,
  fechaActual: string,
  fechaAnterior: string,
  multiplicador: number,
}

export interface ION_Data_Source {
  ID: number,
  Name: string,
  NamespaceID: number,
  SourceTypeID: number,
  TimeZoneID: number,
  Descripcion: string,
  Signature: number,
  DisplayName: string,
}

export interface RegistroManual {
  id: number,
  medidorId: number,
  sourceId: number,
  fecha: string,
  quantityId: number,
  valor: number,
  multiplicador: number,
}
export interface ION_Data {
  sourceID: number,
  TimestampUTC: string,
  sourceName: string,
  quantityID: number,
  quantityName: string,
  dataLog2ID: string,
  Value: number,
  Fecha: string,
}

export interface ContractMeter {
  mostrar: boolean,
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
  zonaId: number,
  diaGeneracion: number,
  diasDisponibles: number,
  Direccion: string,
  Telefono: string,
  correo: string,
  tipo: boolean,
  funcionalidad: number,
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
    cliente: string,
    diasDisponibles: number,
    diaGeneracion: number,
    direccion: string,
    telefono: string,
    correo: string
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
      ConsumoExterno: number,
      ConsumoInterno: number,
      LecturaReactiva: number,
      LecturaActivaExportada: number,
      descripcion: string,
      CEF: number,
      PCF: number,
      FP: number,
      PCFR: number,
      ESC: number,
      EAX: number,
      PPPT: number,
      funcionalidad: number,
      mostrar: boolean,
      historico: {
        lecturaActivaActual: number,
        lecturaActivaAnterior: number,
        lecturaReactivaActual: number,
        lecturaReactivaAnterior: number,
        lecturaActivaExportadaActual: number,
        lecturaActivaExportadaAnterior: number,
        fechaActual: string,
        fechaAnterior: string,
        multiplicador: number,
      }

    }
  ],
  vmedidor?: [
    {
      id: number,
      descripcion: string,
      LecturaActiva: number,
      LecturaReactiva: number,
      mostrar: boolean,
      porcentaje: number,
    }
  ],
  totalLecturaActivaAjustada: number,
  totalLecturaReactivaAjustada: number,
  totalEnergiaFotovoltaicaActivaConsumida: number,
  totalEnergiaFotovoltaicaReactivaConsumida: number,
  totalEnergiaActivaExportada: number,
  totalEnergiaDeInyeccionConsumida: number,
  CEFTotal: number,
  PCFTotal: number,
  PCFRTotal: number,
  FPTotal: number,
  PPPTT: number,
  PPS: number,
  PT: number,
  PBE: number,
  ECR: number,
  ESG: number,
  ModoCalculoSolar: boolean,
  diasFacturados: number,


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
    let lecturasEnergiaActiva: ION_Data[] = [], lecturasEnergiaReactiva: ION_Data[] = [], lecturasEnergiaActivaExportada: ION_Data[] = [], historicoMedidorConsumo: Array<MedidorSelect> = [];
    let EnergiaReactiva = 91, EnergiaActiva = 129, EnergiaActivaExportada = 1001, Exportada = 139;
    let medidorEEH = 0, medidorGeneracionSolar = 1;
    let tarifaEnergiaExterna = 13;
    let cliente = 3, proveedorExterno = 1, proveedorInterno = 4;
    let MedidorFronteraSourceID = 0;
    let FS = 0, EAC = 0, ESG = 0, EXR = 0, ECR = 0, ETCR = 0;
    let PBE = 0;
    let PI = 0, ETCE = 0, ETO = 0;
    let fechaInicial = (new Date(generateInvoice.fechaInicial).getMinutes()) % 15;
    let fechaFinal = (new Date(generateInvoice.fechaFinal).getMinutes()) % 15;

    if (fechaInicial != 0 || fechaFinal != 0) {
      return {error: "El rango de facturacion debe respetar intervalos de 15 minutos exactos"};
    }

    let hoy = new Date().toISOString();
    let medidores = await this.getSource();

    PBE = await this.ObtenerTarifaVigente(1, generateInvoice, tarifaEnergiaExterna);

    let facturaEEHVigente = await this.searchValidInvoice(generateInvoice);

    lecturasEnergiaActiva = await this.getAllMetersIONDATA(generateInvoice, EnergiaActiva, medidores);
    // console.log(lecturasEnergiaActiva);

    lecturasEnergiaReactiva = await this.getAllMetersIONDATA(generateInvoice, EnergiaReactiva, medidores);

    lecturasEnergiaActivaExportada = await this.getAllMetersIONDATA(generateInvoice, Exportada, medidores);

    // console.log("-----------------------------------------------------------------------------------");

    let contratosClientes = await this.metersOnContract(hoy, cliente);
    let contratosProveedorExterno: ContractMeter[] = await this.metersOnContract(hoy, proveedorExterno);

    let contratosProveedorInterno: ContractMeter[] = await this.metersOnContract(hoy, proveedorInterno);
    historicoMedidorConsumo = await this.LecturasAjustadas(lecturasEnergiaActiva, lecturasEnergiaReactiva, lecturasEnergiaActivaExportada, medidores);

    // console.log(historicoMedidorConsumo);
    let lecturasMedidoresPorContrato = await this.identifyMetersOnContract(historicoMedidorConsumo, contratosClientes, PBE, generateInvoice);

    lecturasMedidoresPorContrato = await this.aplyVirtualMeters(lecturasMedidoresPorContrato);

    let lecturasManuales = await this.ObetenerLecturasManualesPorFecha(generateInvoice.fechaInicial, generateInvoice.fechaFinal, EnergiaActiva, MedidorFronteraSourceID);
    ECR = await this.LecturasMedidorFrontera(historicoMedidorConsumo, EnergiaActiva, lecturasManuales, contratosProveedorExterno, 0);
    lecturasManuales = await this.ObetenerLecturasManualesPorFecha(generateInvoice.fechaInicial, generateInvoice.fechaFinal, EnergiaActivaExportada, MedidorFronteraSourceID);
    EXR = await this.LecturasMedidorFrontera(historicoMedidorConsumo, EnergiaActivaExportada, lecturasManuales, contratosProveedorExterno, 0);
    ESG = await this.SumaEnergiaDeMedidores(contratosProveedorInterno, historicoMedidorConsumo, 1);
    let ESIR = await this.SumaEnergiasExportadas(contratosProveedorInterno, lecturasEnergiaActivaExportada, 2);
    ETCR = ECR + ESG;

    if (!ECR && generateInvoice.facturaEEH === true) {
      return {error: "No existen lecturas de medidor de frontera para este periodo"};
    }

    ETCE = await this.energiaActivaConsumidaPorClientes(lecturasMedidoresPorContrato);
    ETCE -= ESG + ESIR;
    ESG -= ESIR;
    EAC = ESG - EXR;
    FS = EAC / (ECR + EAC);
    ETO = EAC + ECR;
    let PT = ECR - ETCE;
    let PPT = PT / ECR;

    lecturasMedidoresPorContrato = await this.PorcentajeParticipacionEnConsumoNeto(ETCE, lecturasMedidoresPorContrato, PT, ECR, ESG);
    lecturasMedidoresPorContrato = await this.DistribucionDeInyeccionSolar(lecturasMedidoresPorContrato, ESIR, PBE);
    lecturasMedidoresPorContrato = await this.FactorDePotencia(lecturasMedidoresPorContrato);
    lecturasMedidoresPorContrato = await this.PorcentajePenalizacionPorFP(lecturasMedidoresPorContrato);
    lecturasMedidoresPorContrato = await this.CargoPorEnergiaFotovoltaicaPorMedidor(lecturasMedidoresPorContrato, PBE, FS, EAC, ETCR);
    lecturasMedidoresPorContrato = await this.ProporcionClienteFinal(lecturasMedidoresPorContrato, ECR);
    console.log(lecturasMedidoresPorContrato);
    console.log("---------------------------------------------------------------");

    console.log(lecturasMedidoresPorContrato[0]);
    console.log("---------------------------------------------------------------");

    console.log(lecturasMedidoresPorContrato[1]);
    console.log("---------------------------------------------------------------");

    console.log(lecturasMedidoresPorContrato[2]);
    console.log("---------------------------------------------------------------");

    console.log(lecturasMedidoresPorContrato);
    console.log("---------------------------------------------------------------");
    console.log("ESG: " + ESG);
    console.log("ECR: " + ECR);
    console.log("EXR: " + (EXR));
    console.log("ETCE: " + (ETCE));
    console.log("PPT: " + (PPT));
    console.log("PT: " + (PT));
    console.log("ESIR: " + (ESIR));

    if (facturaEEHVigente[0] && generateInvoice.facturaEEH === true) {
      let listadoCargos = await this.ObetenerCargosPorFactura(facturaEEHVigente[0].id);
      lecturasMedidoresPorContrato = await this.DistribucionCargosPorCliente(listadoCargos, lecturasMedidoresPorContrato, facturaEEHVigente[0].cargoReactivo, PPT);
    }
    if (!facturaEEHVigente[0] && generateInvoice.facturaEEH === true) {
      return {error: "No existe una factura de proveedor externo para este periodo"};
    }

    PI = 1 - (ETCE / ETO);

    if (generateInvoice.contratoId) {
      return lecturasMedidoresPorContrato.find(element => element.contrato.contratoCodigo === generateInvoice.contratoId);
    }

    return lecturasMedidoresPorContrato;
  }

  async DistribucionDeInyeccionSolar(lecturasMedidoresPorContrato: LecturasPorContrato[], ESIR: number, PBE: number) {

    for (let i = 0; i < lecturasMedidoresPorContrato.length; i++) {
      lecturasMedidoresPorContrato[i].totalEnergiaDeInyeccionConsumida += lecturasMedidoresPorContrato[i].PPPTT * ESIR;
      lecturasMedidoresPorContrato[i].CEFTotal += lecturasMedidoresPorContrato[i].totalEnergiaDeInyeccionConsumida * PBE;
    }

    return lecturasMedidoresPorContrato;
  }

  async PorcentajeParticipacionEnConsumoNeto(ETCE: number, lecturasMedidoresPorContrato: LecturasPorContrato[], PPT: number, ECR: number, ESG: number) {

    for (let i = 0; i < lecturasMedidoresPorContrato.length; i++) {
      for (let j = 0; j < lecturasMedidoresPorContrato[i].medidor.length; j++) {
        if (lecturasMedidoresPorContrato[i].medidor[j].funcionalidad === 0) {
          lecturasMedidoresPorContrato[i].medidor[j].PPPT = lecturasMedidoresPorContrato[i].medidor[j].ConsumoExterno / ETCE;
          lecturasMedidoresPorContrato[i].PPPTT += lecturasMedidoresPorContrato[i].medidor[j].PPPT;
          lecturasMedidoresPorContrato[i].PT = PPT;
          lecturasMedidoresPorContrato[i].ESG = ESG;
          lecturasMedidoresPorContrato[i].ECR = ECR;


        }
      }
    }

    return lecturasMedidoresPorContrato;

  }

  async PorcentajeParticipacionSolar(ETCR: number, ESG: number, lecturasMedidoresPorContrato: LecturasPorContrato[], metodoDistribucionInterna: boolean) {

    for (let i = 0; i < lecturasMedidoresPorContrato.length; i++) {
      if (metodoDistribucionInterna) {
        lecturasMedidoresPorContrato[i].PPS = lecturasMedidoresPorContrato[i].totalEnergiaFotovoltaicaActivaConsumida / ESG;
      } else {

        lecturasMedidoresPorContrato[i].PPS = lecturasMedidoresPorContrato[i].totalLecturaActivaAjustada / ETCR;
      }
    }

    return lecturasMedidoresPorContrato;
  }

  async searchValidInvoice(generateInvoice: GenerateInvoice) {
    let facturaEEHVigente = await this.getFacturaEHH(generateInvoice);

    return facturaEEHVigente;
  }

  async getFacturaEHH(generateInvoice: GenerateInvoice) {

    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_EHH_INVOICE} where fechaInicial = '${generateInvoice.fechaInicial}' and fechaFinal = '${generateInvoice.fechaFinal}'and estado = 1`,
    );

  }

  async ObtenerMedidoresActivos(tipo: number, estado: number) {
    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_ACTIVE_SOURCE}  where funcionalidad = ${tipo} and estado = ${estado} ORDER BY Name ASC`,
    );
  }

  async getSource() {
    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_SOURCE}`,
    );


  }

  async getIONDATA(generateInvoice: GenerateInvoice, quantityID: number) {
    return await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_IONDATA} where (TimestampUTC = dateadd(hour,6,'${generateInvoice.fechaInicial}') or TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaFinal}')) and quantityID = ${quantityID} ORDER BY sourceName ASC`,
    );
  }

  async getAllMetersIONDATA(generateInvoice: GenerateInvoice, quantityID: number, ListaMedidores: ION_Data_Source[]) {
    let historicoLecturas: Array<ION_Data> = [];
    let lecturaTemporalInicial: Array<ION_Data> = [], lecturaTemporalFinal: Array<ION_Data> = [];
    let posicionInicial: number = 1, lecturaTemporal: number = 0, posicionBuscada: number = 0;
    let cantidadCiclos: number = 0, cantidadCiclosI: number = 0, cantidadCiclosF: number = 0;

    for (let i = 0; i < ListaMedidores.length; i++) {
      let lecturaReemplazo!: ION_Data;
      let historicoLecturasPorMedidor: Array<ION_Data> = await this.facturaManualRepository.dataSource.execute(
        `${viewOf.GET_ALL_IONDATA} where (TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaInicial}') or TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaFinal}')) and quantityID = ${quantityID}  and sourceID = ${ListaMedidores[i].ID} ORDER BY sourceName ASC`,
      );

      for (let j = 0; j < historicoLecturasPorMedidor.length; j++) {
        if (historicoLecturasPorMedidor.length > 1) {

          if (!historicoLecturasPorMedidor[j].Value) {
            let direccion = await this.identificarLecturaFaltante(new Date(historicoLecturasPorMedidor[j].TimestampUTC), generateInvoice);

            while (!lecturaReemplazo && j < historicoLecturasPorMedidor.length && cantidadCiclos <= 192) {

              if (direccion < 0) {
                if (lecturaTemporalFinal.length < 1) {
                  lecturaTemporalFinal = await this.facturaManualRepository.dataSource.execute(`${viewOf.GET_ALL_IONDATA} where (TimestampUTC =  dateadd(hour,+6, dateadd(MINUTE, ${15 * cantidadCiclos},'${generateInvoice.fechaInicial}'))) and quantityID = ${quantityID} and Value IS NOT NULL and sourceID = ${ListaMedidores[i].ID} ORDER BY sourceName ASC`);
                }
                if (lecturaTemporalInicial.length < 1) {
                  lecturaTemporalInicial = await this.facturaManualRepository.dataSource.execute(`${viewOf.GET_ALL_IONDATA} where (TimestampUTC =  dateadd(hour,+6, dateadd(MINUTE, -${15 * cantidadCiclos},'${generateInvoice.fechaInicial}'))) and quantityID = ${quantityID}  and Value IS NOT NULL   and sourceID = ${ListaMedidores[i].ID} ORDER BY sourceName ASC`);

                }
                if (lecturaTemporalInicial.length > 0 && lecturaTemporalFinal.length > 0) {
                  lecturaReemplazo = await this.GenerarlecturaTemporal(quantityID, ListaMedidores[i], cantidadCiclos, direccion, lecturaTemporalInicial[0], lecturaTemporalFinal[0], generateInvoice.fechaInicial, generateInvoice.fechaFinal);
                  lecturaTemporalInicial.length = 0;
                  lecturaTemporalFinal.length = 0;
                }

              } else {
                if (lecturaTemporalFinal.length < 1) {
                  lecturaTemporalFinal = await this.facturaManualRepository.dataSource.execute(`${viewOf.GET_ALL_IONDATA} where (TimestampUTC =  dateadd(hour,+6, dateadd(MINUTE, ${15 * cantidadCiclos},'${generateInvoice.fechaFinal}'))) and quantityID = ${quantityID} and Value IS NOT NULL and sourceID = ${ListaMedidores[i].ID} ORDER BY sourceName ASC`);
                }
                if (lecturaTemporalInicial.length < 1) {
                  lecturaTemporalInicial = await this.facturaManualRepository.dataSource.execute(`${viewOf.GET_ALL_IONDATA} where (TimestampUTC =  dateadd(hour,+6, dateadd(MINUTE, -${15 * cantidadCiclos},'${generateInvoice.fechaFinal}'))) and quantityID = ${quantityID}  and Value IS NOT NULL   and sourceID = ${ListaMedidores[i].ID} ORDER BY sourceName ASC`);

                }
                if (lecturaTemporalInicial.length > 0 && lecturaTemporalFinal.length > 0) {
                  lecturaReemplazo = await this.GenerarlecturaTemporal(quantityID, ListaMedidores[i], cantidadCiclos, direccion, lecturaTemporalInicial[0], lecturaTemporalFinal[0], generateInvoice.fechaFinal, generateInvoice.fechaInicial);
                  lecturaTemporalInicial.length = 0;
                  lecturaTemporalFinal.length = 0;
                }
              }

              //

              cantidadCiclos++;
            }

            historicoLecturasPorMedidor[j] = lecturaReemplazo;
            cantidadCiclos = 0;


          }
          historicoLecturas.push(historicoLecturasPorMedidor[j]);
        }

        if (historicoLecturasPorMedidor.length == 0) {
          historicoLecturasPorMedidor.push(await this.ObtenerLecturaEquivalente(quantityID, ListaMedidores[i], generateInvoice.fechaFinal));
          historicoLecturasPorMedidor.push(await this.ObtenerLecturaEquivalente(quantityID, ListaMedidores[i], generateInvoice.fechaInicial));
          if (historicoLecturasPorMedidor.length > 1) {

            historicoLecturas.push(historicoLecturasPorMedidor[j]);
          }
        }

        if (historicoLecturasPorMedidor.length == 1) {
          console.log("entre");

          let direccion = await this.identificarLecturaFaltante(new Date(historicoLecturasPorMedidor[j].TimestampUTC), generateInvoice);
          if (direccion < 0) {
            historicoLecturasPorMedidor.push(await this.ObtenerLecturaEquivalente(quantityID, ListaMedidores[i], generateInvoice.fechaFinal));

          } else {
            historicoLecturasPorMedidor.push(await this.ObtenerLecturaEquivalente(quantityID, ListaMedidores[i], generateInvoice.fechaInicial));

          }

          historicoLecturas.push(historicoLecturasPorMedidor[j]);
        }


      }

    }
    return historicoLecturas;

  }

  async ObtenerLecturaEquivalente(quantityID: number, medidor: ION_Data_Source, fechaFaltante: string) {

    let historicoLecturasPorMedidor: Array<ION_Data> = await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_ALL_IONDATA} where (TimestampUTC BETWEEN  dateadd(hour,6, dateadd(DAY, -30, '${fechaFaltante}')) and dateadd(hour,6,'${fechaFaltante}')) and quantityID = ${quantityID}  and sourceID = ${medidor.ID} ORDER BY Fecha ASC`,
    );
    if (historicoLecturasPorMedidor.length > 0) {
      return historicoLecturasPorMedidor[historicoLecturasPorMedidor.length - 1];
    }
    if (historicoLecturasPorMedidor.length == 0) {
      historicoLecturasPorMedidor = await this.facturaManualRepository.dataSource.execute(
        `${viewOf.GET_ALL_IONDATA} where (TimestampUTC BETWEEN dateadd(hour,6,'${fechaFaltante}') and dateadd(hour,6, dateadd(DAY, 30, '${fechaFaltante}'))) and quantityID = ${quantityID}  and sourceID = ${medidor.ID} ORDER BY Fecha ASC`,
      );
    }
    if (historicoLecturasPorMedidor.length > 0) {
      return historicoLecturasPorMedidor[0];
    }

    return historicoLecturasPorMedidor[0];
  }

  async identificarLecturaFaltante(fecha: Date, generateInvoice: GenerateInvoice) {

    if (fecha < new Date(generateInvoice.fechaFinal)) {
      return -15;
    }

    return 15;
  }

  async GenerarlecturaTemporal(quantityID: number, medidor: ION_Data_Source, cantidadCiclos: number, direccion: number, lecturaTemporalInicial: ION_Data, lecturaTemporalFinal: ION_Data, fechaB: string, fechaO: string) {
    let lecturaTemporal: ION_Data, posicionBuscada = 0;

    lecturaTemporal = {
      sourceID: medidor.ID,
      TimestampUTC: "",
      sourceName: medidor.Descripcion,
      quantityID: quantityID,
      quantityName: "",
      dataLog2ID: "",
      Value: 0,
      Fecha: new Date(Date.parse(fechaB) - (900000 * 24)).toISOString(),

    }
    if (lecturaTemporalInicial && lecturaTemporalFinal) {
      // console.log("Cantidad de ciclos: " + cantidadCiclos);
      // console.log("Fecha B: " + fechaB);
      // console.log("Fecha O: " + fechaO);

      if (direccion < 0) {
        let fechaBuscada = new Date(Date.parse(fechaB) - (900000 * 24)).toISOString();
        let fechaEncontrada = new Date(Date.parse(lecturaTemporalInicial.Fecha) + (900000)).toISOString();
        posicionBuscada = ((Date.parse(fechaBuscada)) - (Date.parse(fechaEncontrada))) / 900000;
      } else {
        let fechaBuscada = new Date(Date.parse(fechaB) - (900000 * 24)).toISOString();
        let fechaEncontrada = new Date(Date.parse(lecturaTemporalInicial.Fecha) + (900000)).toISOString();
        posicionBuscada = ((Date.parse(fechaBuscada)) - (Date.parse(fechaEncontrada))) / 900000;
      }
      // console.log("Posicion Buscada: " + posicionBuscada);
      lecturaTemporal.Value = (((lecturaTemporalFinal.Value - lecturaTemporalInicial.Value) / cantidadCiclos) * (posicionBuscada)) + lecturaTemporalInicial.Value
      // console.log(lecturaTemporal);

      return lecturaTemporal;
    }
    // console.log(lecturaTemporal);

    return lecturaTemporal;

  }
  async ObtenerLecturaManualHistorica(historicoLecturasPorMedidor: ION_Data, generateInvoice: GenerateInvoice, quantityID: number): Promise<ION_Data> {
    // console.log(historicoLecturasPorMedidor.sourceID);

    let lecturaManualObtenida: Array<RegistroManual> = await this.ObetenerLecturasManualesPorFecha(generateInvoice.fechaInicial, generateInvoice.fechaFinal, quantityID, historicoLecturasPorMedidor.sourceID);
    let resultado!: ION_Data;

    if (lecturaManualObtenida) {
      for (let j = 0; j < lecturaManualObtenida.length; j++) {
        if (lecturaManualObtenida[j].fecha > historicoLecturasPorMedidor.Fecha || lecturaManualObtenida[j].fecha < historicoLecturasPorMedidor.Fecha) {

          let medidorEncontrado: ION_Data_Source = await this.facturaManualRepository.dataSource.execute(
            `SELECT * FROM ION_Data.dbo.Source WHERE ID = ${lecturaManualObtenida[j].sourceId}`,
          );

          resultado = {
            sourceID: medidorEncontrado.ID,
            sourceName: medidorEncontrado.Name,
            quantityID: lecturaManualObtenida[j].quantityId,
            Fecha: lecturaManualObtenida[j].fecha,
            TimestampUTC: "",
            dataLog2ID: '',
            Value: lecturaManualObtenida[j].valor,
            quantityName: ""
          };
        }
      }
    }

    return resultado;

  }

  async GenerarLecturaPromediadaTemporal(lecturaInicial: number, lecturaFinal: number, fechaActual: string, numeroRegistros: number, historicoLecturas: ION_Data, posisionBuscada: number) {
    let promedio = ((lecturaFinal - lecturaInicial) / numeroRegistros);

    historicoLecturas = {
      sourceID: historicoLecturas.sourceID,
      sourceName: historicoLecturas.sourceName,
      quantityID: historicoLecturas.quantityID,
      Fecha: fechaActual,
      TimestampUTC: "",
      dataLog2ID: '',
      Value: (promedio * posisionBuscada) + lecturaInicial,
      quantityName: historicoLecturas.quantityName
    };

    return historicoLecturas;


  }

  async ObtenerValoresAPromediar(generateInvoice: GenerateInvoice, historicoLecturas: ION_Data, quantityID: number) {
    let lecturasParaPromediar: Array<ION_Data> = await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_ALL_IONDATA} where (TimestampUTC BETWEEN  dateadd(hour, - 168,'${generateInvoice.fechaInicial}') and dateadd(hour, 168,'${generateInvoice.fechaFinal}')) and quantityID = ${quantityID} and sourceID = ${historicoLecturas.sourceID} ORDER BY sourceName ASC`,
    );

    let datos;
    let countNulls = 0;
    let QuinceMinutosMilesegundos = 900000;
    let posicionInicial: number = -1;
    let isInical: boolean = false;

    for (let k = 0; k < lecturasParaPromediar.length; k++) {
      if (lecturasParaPromediar[k].dataLog2ID === historicoLecturas.dataLog2ID) {
        posicionInicial = k;
      }
    }
    if (Date.parse(historicoLecturas.Fecha) > Date.parse(generateInvoice.fechaInicial)) {
      isInical = true;
    }

    for (let j = posicionInicial; j > 0; j) {


      if (Date.parse(lecturasParaPromediar[j].Fecha) <= Date.parse(historicoLecturas.Fecha) && isInical) {

        if (Date.parse(lecturasParaPromediar[j - 1].Fecha) < Date.parse(generateInvoice.fechaInicial) && lecturasParaPromediar[j - 1].Value) {
          let posisionBuscada = 1;


          datos = {
            lecturaInicial: lecturasParaPromediar[j - 1].Value,
            lecturaFinal: historicoLecturas.Value,
            fecha: lecturasParaPromediar[j - 1].Fecha,
            posisionBuscada: posisionBuscada,
          }

          j = -1;
        }

        j--;
      }

      if (Date.parse(lecturasParaPromediar[j].Fecha) >= Date.parse(historicoLecturas.Fecha) && !isInical) {

        if (Date.parse(lecturasParaPromediar[j + 1].Fecha) > Date.parse(generateInvoice.fechaFinal) && lecturasParaPromediar[j + 1].Value) {

          let posisionBuscada = (Date.parse(generateInvoice.fechaFinal) - Date.parse(generateInvoice.fechaInicial)) / QuinceMinutosMilesegundos;

          datos = {
            lecturaInicial: historicoLecturas.Value,
            lecturaFinal: lecturasParaPromediar[j + 1].Value,
            fecha: lecturasParaPromediar[j + 1].Fecha,
            posisionBuscada: posisionBuscada,
          }
          j = -1;
        }

        j++;
      }

      if (lecturasParaPromediar[j].Value == null && j > -1) {
        countNulls++;
      }


    }

    return {datos, countNulls};

  }

  async ObtenerTarifaVigente(estado: number, data: GenerateInvoice, tipoCargoId: number): Promise<number> {
    let Tarifa = await this.facturaManualRepository.dataSource.execute(
      `${viewOf.GET_PT_DETAIL} WHERE estado = ${estado} and (fechaInicio <= '${data.fechaInicial}' and fechaFinal >= '${data.fechaFinal}') and tipoCargoId = ${tipoCargoId}`,
    );

    if (Tarifa) {
      return Tarifa[0] ? Tarifa[0].valor : 0;
    }

    return 0;
  }


  async identifyRollOvers(lecturasEnergiaActivaFinal: ION_Data, lecturasEnergiaActivaInicial: ION_Data, lecturasEnergiaReactivaInicial: ION_Data, lecturasEnergiaReactivaFinal: ION_Data, lecturasEnergiaActivaExportadaInicial: ION_Data, lecturasEnergiaActivaExportadaFinal: ION_Data) {

    let medidorIdentificado = await this.medidorRepository.findOne({where: {sourceId: lecturasEnergiaActivaInicial.sourceID}});
    let rollOver = await this.rollOverRepository.find({where: {medidorId: medidorIdentificado?.id}});
    let consumoActivoAux = lecturasEnergiaActivaFinal.Value - lecturasEnergiaActivaInicial.Value,
      consumoReactivoAux = lecturasEnergiaReactivaFinal.Value - lecturasEnergiaReactivaInicial.Value,
      consumoActivoExportadoAux = (lecturasEnergiaActivaExportadaFinal?.Value - lecturasEnergiaActivaExportadaInicial?.Value) ? (lecturasEnergiaActivaExportadaFinal.Value - lecturasEnergiaActivaExportadaInicial.Value) : 0;
    let consumoActivo = 0, consumoReactivo = 0, consumoActivoExportado = 0;
    consumoActivoAux = consumoActivoAux < 0 ? (consumoActivoAux * -1) : consumoActivoAux;
    consumoReactivoAux = consumoReactivoAux < 0 ? (consumoReactivoAux * -1) : consumoReactivoAux;
    consumoActivoExportadoAux = consumoActivoExportadoAux < 0 ? (consumoActivoExportadoAux * -1) : consumoActivoExportadoAux;

    if (rollOver) {
      for (let c = 0; c < rollOver.length; c++) {

        if (rollOver[c].energia === 1 && rollOver[c].estado === true) {
          if (Date.parse(rollOver[c].fechaInicial) <= Date.parse(lecturasEnergiaActivaFinal.Fecha) && Date.parse(rollOver[c].fechaInicial) >= Date.parse(lecturasEnergiaActivaInicial.Fecha) && medidorIdentificado?.id === rollOver[c].medidorId) {

            consumoActivo += rollOver[c].lecturaNueva - rollOver[c].lecturaAnterior;
            consumoActivo *= medidorIdentificado?.multiplicador || 1;
          }
        }

        if (rollOver[c].energia === 0 && rollOver[c].estado === true) {
          if (Date.parse(rollOver[c].fechaInicial) <= Date.parse(lecturasEnergiaReactivaFinal.Fecha) && Date.parse(rollOver[c].fechaInicial) >= Date.parse(lecturasEnergiaReactivaInicial.Fecha) && medidorIdentificado?.id === rollOver[c].medidorId) {
            //console.log(lecturasEnergiaReactivaFinal.Value + ' + ' + lecturasEnergiaReactivaInicial.Value + ' = ');
            consumoReactivo += rollOver[c].lecturaNueva - rollOver[c].lecturaAnterior;
            consumoReactivo *= medidorIdentificado?.multiplicador || 1;
          }

        }

        if (rollOver[c].energia === 2 && rollOver[c].estado === true) {
          if (Date.parse(rollOver[c].fechaInicial) <= Date.parse(lecturasEnergiaActivaExportadaFinal.Fecha) && Date.parse(rollOver[c].fechaInicial) >= Date.parse(lecturasEnergiaActivaExportadaInicial.Fecha) && medidorIdentificado?.id === rollOver[c].medidorId) {
            //console.log(lecturasEnergiaReactivaFinal.Value + ' + ' + lecturasEnergiaReactivaInicial.Value + ' = ');
            consumoActivoExportado += rollOver[c].lecturaNueva - rollOver[c].lecturaAnterior;
            consumoActivoExportado *= medidorIdentificado?.multiplicador || 1;
          }

        }
      }

    }

    return {
      sourceId: lecturasEnergiaActivaFinal.sourceID,
      descripcion: medidorIdentificado?.descripcion,
      LecturaActivaFinal: consumoActivo > 0 ? consumoActivo : consumoActivoAux,
      LecturaReactivaFinal: consumoReactivo > 0 ? consumoReactivo : consumoReactivoAux,
      LecturaActivaExportadaFinal: consumoActivoExportado > 0 ? consumoActivoExportado : consumoActivoExportadoAux,
      lecturaActivaActual: lecturasEnergiaActivaFinal.Value,
      lecturaActivaAnterior: lecturasEnergiaActivaInicial.Value,
      lecturaActivaExportadaActual: lecturasEnergiaActivaExportadaFinal?.Value ? lecturasEnergiaActivaExportadaFinal.Value : 0,
      lecturaActivaExportadaAnterior: lecturasEnergiaActivaExportadaInicial?.Value ? lecturasEnergiaActivaExportadaInicial.Value : 0,
      lecturaReactivaActual: lecturasEnergiaReactivaFinal.Value,
      lecturaReactivaAnterior: lecturasEnergiaReactivaInicial.Value,
      multiplicador: medidorIdentificado?.multiplicador,
    }


  }

  async aplyVirtualMeters(lecturasEnergiaActivaFinal: LecturasPorContrato[]) {
    let vmetersRegistered: Array<number> = [];
    let resta = false, suma = true;
    for (let i = 0; i < lecturasEnergiaActivaFinal.length; i++) {
      for (let j = 0; j < lecturasEnergiaActivaFinal[i].medidor.length; j++) {

        let medidorIdentificado = await this.medidorRepository.findOne({where: {sourceId: lecturasEnergiaActivaFinal[i].medidor[j].sourceID}});

        let medidoresVirtualesRelacionados = await this.medidorVirtualDetalleRepository.find({where: {medidorId: medidorIdentificado?.id}});

        // console.log("------------------------------------------------------------------");
        // console.log("MEDIDOR IDENTIFICADO Y RELACIONADO");

        // console.log(medidorIdentificado);
        // console.log(medidoresVirtualesRelacionados);
        // console.log("------------------------------------------------------------------");


        if (medidoresVirtualesRelacionados.length > 0) {
          for (let m = 0; m < medidoresVirtualesRelacionados.length; m++) {
            let medidoresVirutalesIdentificados = await this.medidorVirtualRepository.findOne({where: {id: medidoresVirtualesRelacionados[m].vmedidorId}});

            if (medidoresVirutalesIdentificados) {

              if (medidoresVirutalesIdentificados.operacion === resta && medidoresVirtualesRelacionados[m].estado && !medidoresVirtualesRelacionados[m].sourceId && !vmetersRegistered.includes(medidoresVirtualesRelacionados[m].id || 0)) {
                if (!lecturasEnergiaActivaFinal[i].vmedidor) {
                  lecturasEnergiaActivaFinal[i].vmedidor = [{
                    id: medidoresVirtualesRelacionados[m].id || 0,
                    descripcion: medidoresVirutalesIdentificados.observacion || '',
                    LecturaActiva: - lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva * medidoresVirutalesIdentificados.porcentaje,
                    LecturaReactiva: - lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                    mostrar: medidoresVirtualesRelacionados[m].mostrar,
                    porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                  }
                  ];

                } else {
                  lecturasEnergiaActivaFinal[i].vmedidor?.push({
                    id: medidoresVirtualesRelacionados[m].id || 0,
                    descripcion: medidoresVirutalesIdentificados.observacion || '',
                    LecturaActiva: - lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva * medidoresVirutalesIdentificados.porcentaje,
                    LecturaReactiva: - lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                    mostrar: medidoresVirtualesRelacionados[m].mostrar,
                    porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                  });

                }
                if (!vmetersRegistered) {

                  vmetersRegistered = [medidoresVirtualesRelacionados[m].id || 0];
                } else {

                  vmetersRegistered.push(medidoresVirtualesRelacionados[m].id || 0);
                }

                lecturasEnergiaActivaFinal[i].totalLecturaActivaAjustada -= lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva;
                lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva -= (lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva * medidoresVirutalesIdentificados.porcentaje);
                lecturasEnergiaActivaFinal[i].totalLecturaActivaAjustada += lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva;

                lecturasEnergiaActivaFinal[i].totalLecturaReactivaAjustada -= lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva;
                lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva -= (lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje);
                lecturasEnergiaActivaFinal[i].totalLecturaReactivaAjustada += lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva;

              }


              if (medidoresVirutalesIdentificados.operacion === resta && medidoresVirtualesRelacionados[m].estado && medidoresVirtualesRelacionados[m].sourceId) {


                for (let h = 0; h < lecturasEnergiaActivaFinal.length; h++) {

                  for (let l = 0; l < lecturasEnergiaActivaFinal[h].medidor.length; l++) {

                    if (lecturasEnergiaActivaFinal[h].medidor[l].sourceID === medidoresVirtualesRelacionados[m].sourceId && !vmetersRegistered.includes(medidoresVirtualesRelacionados[m].id || -1)) {

                      if (!lecturasEnergiaActivaFinal[i].vmedidor) {
                        lecturasEnergiaActivaFinal[i].vmedidor = [{
                          id: medidoresVirtualesRelacionados[m].id || 0,
                          descripcion: medidoresVirutalesIdentificados.observacion || '',
                          LecturaActiva: - (lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva + lecturasEnergiaActivaFinal[h].medidor[l].LecturaActivaExportada) * medidoresVirutalesIdentificados.porcentaje,
                          LecturaReactiva: - lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                          mostrar: medidoresVirtualesRelacionados[m].mostrar,
                          porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                        }
                        ];

                      } else {
                        lecturasEnergiaActivaFinal[i].vmedidor?.push({
                          id: medidoresVirtualesRelacionados[m].id || 0,
                          descripcion: medidoresVirutalesIdentificados.observacion || '',
                          LecturaActiva: - (lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva + lecturasEnergiaActivaFinal[h].medidor[l].LecturaActivaExportada) * medidoresVirutalesIdentificados.porcentaje,
                          LecturaReactiva: - lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                          mostrar: medidoresVirtualesRelacionados[m].mostrar,
                          porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                        });
                      }

                      lecturasEnergiaActivaFinal[i].medidor[j].ConsumoExterno -= lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje;
                      lecturasEnergiaActivaFinal[i].medidor[j].ConsumoInterno += lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje;
                      if (!vmetersRegistered) {

                        vmetersRegistered = [medidoresVirtualesRelacionados[m].id || 0];
                      } else {

                        vmetersRegistered.push(medidoresVirtualesRelacionados[m].id || 0);
                      }

                      lecturasEnergiaActivaFinal[i].totalLecturaActivaAjustada -= lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva;
                      // console.log("--------------------------------------------------------");
                      // console.log(lecturasEnergiaActivaFinal[i].medidor[j].sourceName + " : " + lecturasEnergiaActivaFinal[i].medidor[j].sourceName);

                      // console.log(lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva + " : " + medidoresVirutalesIdentificados.operacion + " : " + (lecturasEnergiaActivaFinal[h].medidor[l].LecturaActivaExportada * medidoresVirutalesIdentificados.porcentaje));

                      // console.log(lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva + " : " + medidoresVirutalesIdentificados.operacion + " : " + (lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje));
                      lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva -= (lecturasEnergiaActivaFinal[h].medidor[l].LecturaActivaExportada * medidoresVirutalesIdentificados.porcentaje);
                      lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva -= (lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje);
                      lecturasEnergiaActivaFinal[i].totalLecturaActivaAjustada += lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva;
                      // console.log("RESULTADO: " + lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva);

                      // console.log("--------------------------------------------------------");

                    }

                  }
                }

              }
              //

              if (medidoresVirutalesIdentificados.operacion === suma && medidoresVirtualesRelacionados[m].estado === true && medidoresVirtualesRelacionados[m].sourceId) {

                for (let h = 0; h < lecturasEnergiaActivaFinal.length; h++) {

                  for (let l = 0; l < lecturasEnergiaActivaFinal[h].medidor.length; l++) {
                    if (lecturasEnergiaActivaFinal[h].medidor[l].sourceID === medidoresVirtualesRelacionados[m].sourceId && !vmetersRegistered.includes(medidoresVirtualesRelacionados[m].id || 0)) {

                      if (!lecturasEnergiaActivaFinal[h].vmedidor) {
                        lecturasEnergiaActivaFinal[h].vmedidor = [{
                          id: medidoresVirtualesRelacionados[m].id || 0,
                          descripcion: medidoresVirutalesIdentificados.observacion || '',
                          LecturaActiva: - lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje,
                          LecturaReactiva: - lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                          mostrar: medidoresVirtualesRelacionados[m].mostrar,
                          porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                        }
                        ];

                      } else {
                        lecturasEnergiaActivaFinal[h].vmedidor?.push({
                          id: medidoresVirtualesRelacionados[m].id || 0,
                          descripcion: medidoresVirutalesIdentificados.observacion || '',
                          LecturaActiva: - lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje,
                          LecturaReactiva: - lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                          mostrar: medidoresVirtualesRelacionados[m].mostrar,
                          porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                        });
                      }
                      if (!vmetersRegistered) {

                        vmetersRegistered = [medidoresVirtualesRelacionados[m].id || 0];
                      } else {

                        vmetersRegistered.push(medidoresVirtualesRelacionados[m].id || 0);
                      }


                      if (!lecturasEnergiaActivaFinal[i].vmedidor) {
                        lecturasEnergiaActivaFinal[i].vmedidor = [{
                          id: medidoresVirtualesRelacionados[m].id || 0,
                          descripcion: medidoresVirutalesIdentificados.observacion || '',
                          LecturaActiva: lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje,
                          LecturaReactiva: lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                          mostrar: medidoresVirtualesRelacionados[m].mostrar,
                          porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                        }
                        ];

                      } else {
                        lecturasEnergiaActivaFinal[i].vmedidor?.push({
                          id: medidoresVirtualesRelacionados[m].id || 0,
                          descripcion: medidoresVirutalesIdentificados.observacion || '',
                          LecturaActiva: lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje,
                          LecturaReactiva: lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                          mostrar: medidoresVirtualesRelacionados[m].mostrar,
                          porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                        });

                      }

                      lecturasEnergiaActivaFinal[i].totalLecturaActivaAjustada -= lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva;
                      lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva += (lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje);
                      lecturasEnergiaActivaFinal[i].totalLecturaActivaAjustada += lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva;

                      lecturasEnergiaActivaFinal[i].totalLecturaReactivaAjustada -= lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva;
                      lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva += (lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje);
                      lecturasEnergiaActivaFinal[i].totalLecturaReactivaAjustada += lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva;


                      lecturasEnergiaActivaFinal[h].totalLecturaActivaAjustada -= lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva;
                      lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva -= (lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje);
                      lecturasEnergiaActivaFinal[h].totalLecturaActivaAjustada += lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva;

                      lecturasEnergiaActivaFinal[h].totalLecturaReactivaAjustada -= lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva;
                      lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva -= (lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje);
                      lecturasEnergiaActivaFinal[h].totalLecturaReactivaAjustada += lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva;

                    }

                  }
                }




              }



            }

          }

        }


      }
    }

    return lecturasEnergiaActivaFinal;
  }

  async RegistrarMedidorVitual() {

  }

  async LecturasAjustadas(lecturasEnergiaActiva: ION_Data[], lecturasEnergiaReactiva: ION_Data[], lecturasEnergiaActivaExportada: ION_Data[], medidores: any) {
    let i = 0;
    let historicoMedidorConsumo: Array<MedidorSelect> = [];

    for (let j = 0; j < lecturasEnergiaActiva.length; j += 2) {

      let auxActiva = lecturasEnergiaActiva[j + 1].Value;
      let auxReactiva = lecturasEnergiaReactiva[j + 1].Value;

      let resultadoRollOver = await this.identifyRollOvers(lecturasEnergiaActiva[j + 1], lecturasEnergiaActiva[j], lecturasEnergiaReactiva[j], lecturasEnergiaReactiva[j + 1], lecturasEnergiaActivaExportada[j], lecturasEnergiaActivaExportada[j + 1]);

      if (lecturasEnergiaActiva[j].sourceID === medidores[i].ID && lecturasEnergiaReactiva[j].sourceID === medidores[i].ID) {
        historicoMedidorConsumo.push(
          {
            sourceId: lecturasEnergiaActiva[j].sourceID,
            descripcion: resultadoRollOver.descripcion,
            sourceName: lecturasEnergiaActiva[j].sourceName,
            quantityID: lecturasEnergiaActiva[0].quantityID,
            totalLecturaActiva: resultadoRollOver.LecturaActivaFinal,
            totalLecturaReactiva: resultadoRollOver.LecturaReactivaFinal,
            lecturaActivaActual: resultadoRollOver.lecturaActivaActual,
            lecturaActivaAnterior: resultadoRollOver.lecturaActivaAnterior,
            lecturaReactivaActual: resultadoRollOver.lecturaReactivaActual,
            lecturaReactivaAnterior: resultadoRollOver.lecturaReactivaAnterior,
            lecturaActivaExportada: 0,
            lecturaActivaExportadaActual: 0,
            lecturaActivaExportadaAnterior: 0,
            fechaActual: lecturasEnergiaActiva[j + 1].Fecha,
            fechaAnterior: lecturasEnergiaActiva[j].Fecha,
            multiplicador: resultadoRollOver.multiplicador || 1,
          }
        );
      }



      lecturasEnergiaActiva[j + 1].Value = auxActiva;
      lecturasEnergiaReactiva[j + 1].Value = auxReactiva;
      i++;
    }

    for (let i = 0; i < historicoMedidorConsumo.length; i++) {
      for (let j = 0; j < lecturasEnergiaActivaExportada.length; j += 2) {
        if (lecturasEnergiaActivaExportada[j].sourceID === medidores[i].ID) {
          historicoMedidorConsumo[i].lecturaActivaExportada = (lecturasEnergiaActivaExportada[j + 1].Value - lecturasEnergiaActivaExportada[j].Value);
          historicoMedidorConsumo[i].lecturaActivaExportada = (lecturasEnergiaActivaExportada[j + 1].Value - lecturasEnergiaActivaExportada[j].Value);
        } else {

        }
        if (historicoMedidorConsumo[i].lecturaActivaExportada < 0) {
          historicoMedidorConsumo[i].lecturaActivaExportada *= -1;
        }

      }

    }
    //console.log(historicoMedidorConsumo);

    return historicoMedidorConsumo;
  }



  async metersOnContract(today: string, tipoContrato: number) {
    let contratosVigentes = this.medidorRepository.dataSource.execute(
      `${viewOf.GET_CMETERS} where estado = 1 and estadocm = 1  and fechaCreacion < '${today}' and fechaVenc > '${today}'  and tipoContratoId = ${tipoContrato}`,
    );

    return contratosVigentes;
  }

  async ObetenerLecturasManualesPorFecha(fechaInicial: string, fechaFinal: string, quantityID: number, sourceID: number) {
    let lecturasManuales = this.medidorRepository.dataSource.execute(
      `${viewOf.GET_MANUAL_REGISTERS_FOR_DATE} where sourceId = ${sourceID} and (fecha = '${fechaInicial}' or fecha = '${fechaFinal}') and quantityId = ${quantityID} ORDER BY valor ASC`,
    );

    return lecturasManuales;
  }

  async ObetenerCargosPorFactura(facturaEEHId: number) {
    let listadoCargos = this.medidorRepository.dataSource.execute(
      `${viewOf.GET_EEHINVOICE_CHARGUES} where id = ${facturaEEHId} and estado = 1`,
    );

    return listadoCargos;

  }


  async identifyMetersOnContract(lecturasMedidores: MedidorSelect[], listadoContratosMedidor: ContractMeter[], PBE: number, generateInvoice: GenerateInvoice) {


    let LecturasResultantes: LecturasPorContrato[] = [];
    let isDetected = false;

    for (let i = 0; i < lecturasMedidores.length; i++) {
      for (let j = 0; j < listadoContratosMedidor.length; j++) {
        isDetected = false;

        if (lecturasMedidores[i].sourceId === listadoContratosMedidor[j].sourceId && listadoContratosMedidor[j].funcionalidad === 0) {

          if (LecturasResultantes.length > 0) {
            for (let c = 0; c < LecturasResultantes.length; c++) {
              if (listadoContratosMedidor[j].codigoContrato === LecturasResultantes[c].contrato.contratoCodigo) {
                LecturasResultantes[c].medidor.push({
                  sourceID: lecturasMedidores[i].sourceId,
                  descripcion: lecturasMedidores[i].descripcion || '',
                  sourceName: lecturasMedidores[i].sourceName,
                  LecturaActiva: lecturasMedidores[i].totalLecturaActiva,
                  LecturaReactiva: lecturasMedidores[i].totalLecturaReactiva,
                  LecturaActivaExportada: 0,
                  ConsumoExterno: lecturasMedidores[i].totalLecturaActiva,
                  ConsumoInterno: 0,
                  PPPT: 0,
                  CEF: 0,
                  PCF: 0,
                  FP: 0,
                  PCFR: 0,
                  ESC: 0,
                  EAX: lecturasMedidores[i].lecturaActivaExportada,
                  funcionalidad: listadoContratosMedidor[j].funcionalidad,
                  mostrar: listadoContratosMedidor[j].mostrar,
                  historico: {
                    lecturaActivaExportadaActual: 0,
                    lecturaActivaExportadaAnterior: 0,
                    fechaActual: lecturasMedidores[i].fechaActual,
                    fechaAnterior: lecturasMedidores[i].fechaAnterior,
                    lecturaActivaActual: lecturasMedidores[i].lecturaActivaActual,
                    lecturaActivaAnterior: lecturasMedidores[i].lecturaActivaAnterior,
                    lecturaReactivaActual: lecturasMedidores[i].lecturaReactivaActual,
                    lecturaReactivaAnterior: lecturasMedidores[i].lecturaReactivaAnterior,
                    multiplicador: lecturasMedidores[i].multiplicador,
                  }
                });
                LecturasResultantes[c].totalEnergiaActivaExportada = 0;
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
                cliente: listadoContratosMedidor[j].nombreActor,
                diasDisponibles: listadoContratosMedidor[j].diasDisponibles,
                diaGeneracion: listadoContratosMedidor[j].diaGeneracion,
                direccion: listadoContratosMedidor[j].Direccion,
                telefono: listadoContratosMedidor[j].Telefono,
                correo: listadoContratosMedidor[j].correo
              },
              medidor: [{
                sourceID: lecturasMedidores[i].sourceId,
                sourceName: lecturasMedidores[i].sourceName,
                descripcion: lecturasMedidores[i].descripcion || '',
                LecturaActiva: lecturasMedidores[i].totalLecturaActiva,
                LecturaReactiva: lecturasMedidores[i].totalLecturaReactiva,
                LecturaActivaExportada: 0,
                ConsumoExterno: lecturasMedidores[i].totalLecturaActiva,
                ConsumoInterno: 0,
                PPPT: 0,
                CEF: 0,
                PCF: 0,
                FP: 0,
                PCFR: 0,
                ESC: 0,
                EAX: lecturasMedidores[i].lecturaActivaExportada,
                funcionalidad: listadoContratosMedidor[j].funcionalidad,
                mostrar: listadoContratosMedidor[j].mostrar,
                historico: {
                  lecturaActivaExportadaActual: 0,
                  lecturaActivaExportadaAnterior: 0,
                  fechaActual: lecturasMedidores[i].fechaActual,
                  fechaAnterior: lecturasMedidores[i].fechaAnterior,
                  lecturaActivaActual: lecturasMedidores[i].lecturaActivaActual,
                  lecturaActivaAnterior: lecturasMedidores[i].lecturaActivaAnterior,
                  lecturaReactivaActual: lecturasMedidores[i].lecturaReactivaActual,
                  lecturaReactivaAnterior: lecturasMedidores[i].lecturaReactivaAnterior,
                  multiplicador: lecturasMedidores[i].multiplicador,
                }
              }],
              totalLecturaActivaAjustada: lecturasMedidores[i].totalLecturaActiva,
              totalLecturaReactivaAjustada: lecturasMedidores[i].totalLecturaReactiva,
              totalEnergiaFotovoltaicaActivaConsumida: 0,
              totalEnergiaFotovoltaicaReactivaConsumida: 0,
              totalEnergiaActivaExportada: 0,
              CEFTotal: 0,
              PCFTotal: 0,
              PCFRTotal: 0,
              PPPTT: 0,
              FPTotal: 0,
              PPS: 0,
              PBE: PBE,
              PT: 0,
              ESG: 0,
              ECR: 0,
              totalEnergiaDeInyeccionConsumida: 0,
              ModoCalculoSolar: false,
              diasFacturados: (Date.parse(generateInvoice.fechaFinal) - Date.parse(generateInvoice.fechaInicial)) / ((900000 * 4) * 24),
            });

          }
        } else if (lecturasMedidores[i].sourceId === listadoContratosMedidor[j].sourceId && listadoContratosMedidor[j].funcionalidad === 1) {

          if (LecturasResultantes.length > 0) {
            for (let c = 0; c < LecturasResultantes.length; c++) {
              if (listadoContratosMedidor[j].codigoContrato === LecturasResultantes[c].contrato.contratoCodigo) {
                LecturasResultantes[c].medidor.push({
                  sourceID: lecturasMedidores[i].sourceId,
                  descripcion: lecturasMedidores[i].descripcion || '',
                  sourceName: lecturasMedidores[i].sourceName,
                  LecturaActiva: lecturasMedidores[i].totalLecturaActiva,
                  LecturaReactiva: lecturasMedidores[i].totalLecturaReactiva,
                  LecturaActivaExportada: 0,
                  ConsumoExterno: lecturasMedidores[i].totalLecturaActiva,
                  ConsumoInterno: 0,
                  PPPT: 0,
                  CEF: 0,
                  PCF: 0,
                  FP: 0,
                  PCFR: 0,
                  ESC: 0,
                  EAX: 0,
                  funcionalidad: listadoContratosMedidor[j].funcionalidad,
                  mostrar: listadoContratosMedidor[j].mostrar,
                  historico: {
                    lecturaActivaExportadaActual: lecturasMedidores[i].lecturaActivaExportada,
                    lecturaActivaExportadaAnterior: lecturasMedidores[i].lecturaActivaExportada,
                    fechaActual: lecturasMedidores[i].fechaActual,
                    fechaAnterior: lecturasMedidores[i].fechaAnterior,
                    lecturaActivaActual: lecturasMedidores[i].lecturaActivaActual,
                    lecturaActivaAnterior: lecturasMedidores[i].lecturaActivaAnterior,
                    lecturaReactivaActual: lecturasMedidores[i].lecturaReactivaActual,
                    lecturaReactivaAnterior: lecturasMedidores[i].lecturaReactivaAnterior,
                    multiplicador: lecturasMedidores[i].multiplicador,
                  }
                });
                // LecturasResultantes[c].totalLecturaActivaAjustada -= LecturasResultantes[c].totalEnergiaFotovoltaicaActivaConsumida;
                // LecturasResultantes[c].totalLecturaReactivaAjustada -= LecturasResultantes[c].totalEnergiaFotovoltaicaReactivaConsumida;
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
                cliente: listadoContratosMedidor[j].nombreActor,
                diasDisponibles: listadoContratosMedidor[j].diasDisponibles,
                diaGeneracion: listadoContratosMedidor[j].diaGeneracion,
                direccion: listadoContratosMedidor[j].Direccion,
                telefono: listadoContratosMedidor[j].Telefono,
                correo: listadoContratosMedidor[j].correo
              },
              medidor: [{
                sourceID: lecturasMedidores[i].sourceId,
                sourceName: lecturasMedidores[i].sourceName,
                descripcion: lecturasMedidores[i].descripcion || '',
                LecturaActiva: lecturasMedidores[i].totalLecturaActiva,
                LecturaReactiva: lecturasMedidores[i].totalLecturaReactiva,
                LecturaActivaExportada: 0,
                ConsumoExterno: lecturasMedidores[i].totalLecturaActiva,
                ConsumoInterno: 0,
                PPPT: 0,
                CEF: 0,
                PCF: 0,
                FP: 0,
                PCFR: 0,
                ESC: 0,
                EAX: 0,
                funcionalidad: listadoContratosMedidor[j].funcionalidad,
                mostrar: listadoContratosMedidor[j].mostrar,
                historico: {
                  lecturaActivaExportadaActual: 0,
                  lecturaActivaExportadaAnterior: 0,
                  fechaActual: lecturasMedidores[i].fechaActual,
                  fechaAnterior: lecturasMedidores[i].fechaAnterior,
                  lecturaActivaActual: lecturasMedidores[i].lecturaActivaActual,
                  lecturaActivaAnterior: lecturasMedidores[i].lecturaActivaAnterior,
                  lecturaReactivaActual: lecturasMedidores[i].lecturaReactivaActual,
                  lecturaReactivaAnterior: lecturasMedidores[i].lecturaReactivaAnterior,
                  multiplicador: lecturasMedidores[i].multiplicador,
                }
              }],
              totalLecturaActivaAjustada: 0,
              totalLecturaReactivaAjustada: 0,
              totalEnergiaFotovoltaicaActivaConsumida: lecturasMedidores[i].totalLecturaActiva,
              totalEnergiaFotovoltaicaReactivaConsumida: lecturasMedidores[i].totalLecturaReactiva,
              totalEnergiaActivaExportada: 0,
              totalEnergiaDeInyeccionConsumida: 0,
              CEFTotal: 0,
              PCFTotal: 0,
              PCFRTotal: 0,
              FPTotal: 0,
              PPPTT: 0,
              PPS: 0,
              PBE: 0,
              PT: 0,
              ESG: 0,
              ECR: 0,
              ModoCalculoSolar: false,
              diasFacturados: (Date.parse(generateInvoice.fechaFinal) - Date.parse(generateInvoice.fechaInicial)) / ((900000 * 4) * 24),
            });

          }
        } else if (lecturasMedidores[i].sourceId === listadoContratosMedidor[j].sourceId && listadoContratosMedidor[j].funcionalidad === 2) {

          if (LecturasResultantes.length > 0) {
            for (let c = 0; c < LecturasResultantes.length; c++) {
              if (listadoContratosMedidor[j].codigoContrato === LecturasResultantes[c].contrato.contratoCodigo) {
                LecturasResultantes[c].medidor.push({
                  sourceID: lecturasMedidores[i].sourceId,
                  descripcion: lecturasMedidores[i].descripcion || '',
                  sourceName: lecturasMedidores[i].sourceName,
                  LecturaActiva: 0,
                  LecturaActivaExportada: lecturasMedidores[i].lecturaActivaExportada,
                  LecturaReactiva: 0,
                  ConsumoExterno: 0,
                  ConsumoInterno: 0,
                  PPPT: 0,
                  CEF: 0,
                  PCF: 0,
                  FP: 0,
                  PCFR: 0,
                  ESC: 0,
                  EAX: 0,
                  funcionalidad: listadoContratosMedidor[j].funcionalidad,
                  mostrar: listadoContratosMedidor[j].mostrar,
                  historico: {
                    lecturaActivaExportadaActual: lecturasMedidores[i].lecturaActivaExportadaActual,
                    lecturaActivaExportadaAnterior: lecturasMedidores[i].lecturaActivaExportadaAnterior,
                    fechaActual: lecturasMedidores[i].fechaActual,
                    fechaAnterior: lecturasMedidores[i].fechaAnterior,
                    lecturaActivaActual: 0,
                    lecturaActivaAnterior: 0,
                    lecturaReactivaActual: 0,
                    lecturaReactivaAnterior: 0,
                    multiplicador: lecturasMedidores[i].multiplicador,
                  }
                });
                LecturasResultantes[c].totalEnergiaActivaExportada += lecturasMedidores[i].lecturaActivaExportada;
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
                cliente: listadoContratosMedidor[j].nombreActor,
                diasDisponibles: listadoContratosMedidor[j].diasDisponibles,
                diaGeneracion: listadoContratosMedidor[j].diaGeneracion,
                direccion: listadoContratosMedidor[j].Direccion,
                telefono: listadoContratosMedidor[j].Telefono,
                correo: listadoContratosMedidor[j].correo
              },
              medidor: [{
                sourceID: lecturasMedidores[i].sourceId,
                sourceName: lecturasMedidores[i].sourceName,
                descripcion: lecturasMedidores[i].descripcion || '',
                LecturaActiva: 0,
                LecturaActivaExportada: lecturasMedidores[i].lecturaActivaExportada,
                LecturaReactiva: 0,
                ConsumoExterno: 0,
                ConsumoInterno: 0,
                PPPT: 0,
                CEF: 0,
                PCF: 0,
                FP: 0,
                PCFR: 0,
                ESC: 0,
                EAX: 0,
                funcionalidad: listadoContratosMedidor[j].funcionalidad,
                mostrar: listadoContratosMedidor[j].mostrar,
                historico: {
                  lecturaActivaExportadaActual: 0,
                  lecturaActivaExportadaAnterior: 0,
                  fechaActual: lecturasMedidores[i].fechaActual,
                  fechaAnterior: lecturasMedidores[i].fechaAnterior,
                  lecturaActivaActual: 0,
                  lecturaActivaAnterior: 0,
                  lecturaReactivaActual: 0,
                  lecturaReactivaAnterior: 0,
                  multiplicador: lecturasMedidores[i].multiplicador,
                }
              }],
              totalLecturaActivaAjustada: 0,
              totalLecturaReactivaAjustada: 0,
              totalEnergiaFotovoltaicaActivaConsumida: 0,
              totalEnergiaFotovoltaicaReactivaConsumida: 0,
              totalEnergiaActivaExportada: 0,
              totalEnergiaDeInyeccionConsumida: 0,
              CEFTotal: 0,
              PCFTotal: 0,
              PCFRTotal: 0,
              FPTotal: 0,
              PPPTT: 0,
              PPS: 0,
              PBE: 0,
              PT: 0,
              ESG: 0,
              ECR: 0,
              ModoCalculoSolar: false,
              diasFacturados: (Date.parse(generateInvoice.fechaFinal) - Date.parse(generateInvoice.fechaInicial)) / ((900000 * 4) * 24),
            });

          }
        }



      }
    }

    //console.log(LecturasResultantes);
    //  console.log(LecturasResultantes);

    return LecturasResultantes;
  }

  async SumaEnergiaDeMedidores(listaMedidores: ContractMeter[], LecturasPorMedidor: MedidorSelect[], tipoMedidor: number) {
    let TotalEnergia = 0;
    //console.log(listaMedidores);


    if (LecturasPorMedidor.length > 0)
      for (let i = 0; i < listaMedidores.length; i++) {
        for (let j = 0; j < LecturasPorMedidor.length; j++) {
          if (listaMedidores[i].sourceId === LecturasPorMedidor[j].sourceId && listaMedidores[i].funcionalidad === tipoMedidor) {
            TotalEnergia += LecturasPorMedidor[j].totalLecturaActiva;

          }
        }
      }

    return TotalEnergia;
  }

  async SumaEnergiasExportadas(listaMedidores: ContractMeter[], lecturasEnergiaActivaExportada: ION_Data[], tipoMedidor: number) {
    let TotalEnergia = 0;
    if (lecturasEnergiaActivaExportada.length > 0)
      for (let i = 0; i < listaMedidores.length; i++) {
        for (let j = 0; j < lecturasEnergiaActivaExportada.length; j += 2) {
          if (listaMedidores[i].sourceId === lecturasEnergiaActivaExportada[j].sourceID && listaMedidores[i].funcionalidad === tipoMedidor) {
            let diferencia = lecturasEnergiaActivaExportada[j + 1].Value - lecturasEnergiaActivaExportada[j].Value;
            TotalEnergia += diferencia < 0 ? (diferencia) * -1 : diferencia;


          }
        }
      }

    return TotalEnergia;
  }

  async energiaActivaConsumidaPorClientes(LecturasPorMedidor: LecturasPorContrato[]) {
    let totalEnergia: number = 0;
    for (let i = 0; i < LecturasPorMedidor.length; i++) {
      for (let j = 0; j < LecturasPorMedidor[i].medidor.length; j++) {
        totalEnergia += LecturasPorMedidor[i].medidor[j].ConsumoExterno;
      }
    }

    return totalEnergia;
  }


  async LecturasMedidorFrontera(LecturasPorMedidor: MedidorSelect[], quantityID: number, lecturasManuales: any[], cotratosProveedorExterno: ContractMeter[], funcionalidad: number) {
    let LecturasFrontera = 0;
    for (let i = 0; i < LecturasPorMedidor.length; i++) {
      for (let j = 0; j < cotratosProveedorExterno.length; j++) {
        if (LecturasPorMedidor[i].sourceId === cotratosProveedorExterno[j].sourceId && LecturasPorMedidor[i].quantityID === quantityID && cotratosProveedorExterno[j].funcionalidad === funcionalidad) {
          LecturasFrontera += LecturasPorMedidor[i].totalLecturaActiva * lecturasManuales[0].multiplicador;
        }

      }
    }
    if (LecturasFrontera == 0) {
      if (lecturasManuales.length > 1) {

        LecturasFrontera = (lecturasManuales[1].valor - lecturasManuales[0].valor) * lecturasManuales[0].multiplicador;
      }
    }

    return LecturasFrontera;
  }

  async CargoPorEnergiaFotovoltaicaPorMedidor(LecturasPorMedidor: LecturasPorContrato[], PBE: number, FS: number, ESG: number, ETCR: number) {
    let metodoDistribucionInterna: boolean = false;
    for (let i = 0; i < LecturasPorMedidor.length; i++) {
      LecturasPorMedidor[i].totalEnergiaFotovoltaicaActivaConsumida = 0;
      for (let j = 0; j < LecturasPorMedidor[i].medidor.length; j++) {
        if (LecturasPorMedidor[i].medidor[j].funcionalidad === 1) {
          LecturasPorMedidor[i].medidor[j].CEF = PBE * LecturasPorMedidor[i].medidor[j].LecturaActiva;
          LecturasPorMedidor[i].CEFTotal += LecturasPorMedidor[i].medidor[j].CEF;
          LecturasPorMedidor[i].totalEnergiaFotovoltaicaActivaConsumida += LecturasPorMedidor[i].medidor[j].LecturaActiva;
          LecturasPorMedidor[i].PBE = PBE;
          metodoDistribucionInterna = true;
          LecturasPorMedidor[i].ModoCalculoSolar = true;

        }
        // if (LecturasPorMedidor[i].medidor[j].funcionalidad === 2) {
        //   console.log("--------------------------------------------");
        //   console.log("Medidor de inyeccion identificado");

        //   console.log(LecturasPorMedidor[i].medidor[j]);
        //   console.log("--------------------------------------------");

        //   LecturasPorMedidor[i].medidor[j].CEF = PBE * LecturasPorMedidor[i].medidor[j].LecturaActivaExportada;
        //   LecturasPorMedidor[i].CEFTotal += LecturasPorMedidor[i].medidor[j].CEF;
        //   LecturasPorMedidor[i].PBE = PBE;
        //   metodoDistribucionInterna = true;
        //   LecturasPorMedidor[i].ModoCalculoSolar = true;

        // }
      }
    }

    LecturasPorMedidor = await this.PorcentajeParticipacionSolar(ETCR, ESG, LecturasPorMedidor, metodoDistribucionInterna);

    if (!metodoDistribucionInterna) {
      for (let i = 0; i < LecturasPorMedidor.length; i++) {
        for (let j = 0; j < LecturasPorMedidor[i].medidor.length; j++) {
          LecturasPorMedidor[i].medidor[j].CEF = PBE * (LecturasPorMedidor[i].PPS * ESG);
          LecturasPorMedidor[i].CEFTotal += LecturasPorMedidor[i].medidor[j].CEF;
          //console.log(LecturasPorMedidor[i].CEFTotal);

          LecturasPorMedidor[i].PBE = PBE;
        }
      }

    }


    return LecturasPorMedidor;

  }

  async ProporcionClienteFinal(LecturasPorMedidor: LecturasPorContrato[], ECR: number) {
    for (let i = 0; i < LecturasPorMedidor.length; i++) {
      for (let j = 0; j < LecturasPorMedidor[i].medidor.length; j++) {
        if (LecturasPorMedidor[i].medidor[j].funcionalidad === 0) {
          LecturasPorMedidor[i].medidor[j].PCF = LecturasPorMedidor[i].medidor[j].LecturaActiva / ECR;
          LecturasPorMedidor[i].PCFTotal += LecturasPorMedidor[i].medidor[j].PCF;
        }
      }
    }
    return LecturasPorMedidor;

  }

  async DistribucionCargosPorCliente(listadoCargos: CargosFacturaEEH[], listadoContratosMedidor: LecturasPorContrato[], cargoReactivo: number, PPT: number) {
    for (let i = 0; i < listadoContratosMedidor.length; i++) {
      let total = 0;
      let totalCargos = 0;
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
        totalCargos += listadoCargos[j].valor;
        total += listadoCargos[j].valor * listadoContratosMedidor[i].PCFTotal;
      }


      listadoContratosMedidor[i].cargo?.push({
        nombre: 'Cargo por energia fotovoltaica',
        valorAjustado: listadoContratosMedidor[i].CEFTotal,
      });

      listadoContratosMedidor[i].cargo?.push({
        nombre: 'Perdidas de transformación',
        valorAjustado: listadoContratosMedidor[i].PPPTT * (totalCargos * PPT),
      });

      listadoContratosMedidor[i].cargo?.push({
        nombre: 'Cargo Reactivo',
        valorAjustado: listadoContratosMedidor[i].PCFRTotal * cargoReactivo,
      });

      //console.log(listadoContratosMedidor[i].PCFRTotal * cargoReactivo);
      total += listadoContratosMedidor[i].PPPTT * (totalCargos * PPT);
      total += listadoContratosMedidor[i].CEFTotal;
      total += listadoContratosMedidor[i].PCFRTotal * cargoReactivo;

      listadoContratosMedidor[i].cargo?.push({
        nombre: 'Total',
        valorAjustado: total
      });
      total = 0;

    }
    return listadoContratosMedidor;
  }

  async FactorDePotencia(listadoContratosMedidor: LecturasPorContrato[]) {
    for (let i = 0; i < listadoContratosMedidor.length; i++) {
      for (let j = 0; j < listadoContratosMedidor[i].medidor.length; j++) {
        let total = listadoContratosMedidor[i].medidor[j].LecturaActiva + listadoContratosMedidor[i].medidor[j].LecturaReactiva;

        if (listadoContratosMedidor[i].medidor[j].LecturaActiva > 0 && listadoContratosMedidor[i].medidor[j].LecturaReactiva > 0) {
          listadoContratosMedidor[i].medidor[j].FP = (listadoContratosMedidor[i].medidor[j].LecturaActiva) / Math.sqrt(Math.pow(listadoContratosMedidor[i].medidor[j].LecturaActiva, 2) + Math.pow(listadoContratosMedidor[i].medidor[j].LecturaReactiva, 2));
        } else {
          listadoContratosMedidor[i].medidor[j].FP = 0;
        }
        listadoContratosMedidor[i].FPTotal += listadoContratosMedidor[i].medidor[j].FP;
        //console.log('resultado: ' + listadoContratosMedidor[i].medidor[j].FP);

        //console.log(listadoContratosMedidor[i].medidor[j].FP);

      }
      if (listadoContratosMedidor[i].FPTotal > 0) {
        listadoContratosMedidor[i].FPTotal /= listadoContratosMedidor[i].medidor.length;
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
          // console.log('-----------------------------------------');
          // console.log('Penalizacion por FP');
          // console.log('LA: ' + listadoContratosMedidor[i].medidor[j].LecturaActiva + ' / ' + EAPFR + ' = ' + listadoContratosMedidor[i].medidor[j].LecturaActiva / EAPFR);
          // console.log('-----------------------------------------');

        }
        else
          listadoContratosMedidor[i].medidor[j].PCFR = listadoContratosMedidor[i].medidor[j].PCFR;


        listadoContratosMedidor[i].PCFRTotal += listadoContratosMedidor[i].medidor[j].PCFR;
      }

    }

    return listadoContratosMedidor;
  }


}



