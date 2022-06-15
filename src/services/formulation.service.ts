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
  correo: string
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
      LecturaReactiva: number,
      descripcion: string,
      CEF: number,
      PCF: number,
      FP: number,
      PCFR: number,
      historico: {
        lecturaActivaActual: number,
        lecturaActivaAnterior: number,
        lecturaReactivaActual: number,
        lecturaReactivaAnterior: number,
        fechaActual: string,
        fechaAnterior: string,
        multiplicador: number,
      }

    }
  ],
  vmedidor?: [
    {
      descripcion: string,
      LecturaActiva: number,
      LecturaReactiva: number,
      porcentaje: number,
    }
  ],
  totalLecturaActivaAjustada: number,
  totalLecturaReactivaAjustada: number,
  CEFTotal: number,
  PCFTotal: number,
  PCFRTotal: number,
  FPTotal: number


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
    let lecturasEnergiaActiva: ION_Data[] = [], lecturasEnergiaReactiva: ION_Data[] = [], historicoMedidorConsumo: Array<MedidorSelect> = [];
    let EnergiaReactiva = 91, EnergiaActiva = 129, EnergiaActivaExportada = 1001;
    let medidorEEH = 0, medidorGeneracionSolar = 1;
    let tarifaSolar = 0, tarifaEnergiaExterna = 13;
    let MedidorFronteraSourceID = 0;
    let FS = 0, EAC = 0, ESG = 0, EXR = 0, ECR = 0;
    let PBE = 0;
    let PI = 0, ETCU = 0, ETO = 0;


    let consumoEEH: ION_Data_Source[] = await this.ObtenerMedidoresActivos(medidorEEH, 1);
    let consumoSolar: ION_Data_Source[] = await this.ObtenerMedidoresActivos(medidorGeneracionSolar, 1);
    let hoy = new Date().toISOString();
    let medidores = await this.getSource();

    let facturaEEHVigente = await this.searchValidInvoice(generateInvoice);

    lecturasEnergiaActiva = await this.getAllMetersIONDATA(generateInvoice, EnergiaActiva, medidores);
    lecturasEnergiaReactiva = await this.getAllMetersIONDATA(generateInvoice, EnergiaReactiva, medidores);

    let contratosVigentes = await this.metersOnContract(hoy);
    historicoMedidorConsumo = await this.LecturasAjustadas(lecturasEnergiaActiva, lecturasEnergiaReactiva, medidores)
    let lecturasMedidoresPorContrato = await this.identifyMetersOnContract(historicoMedidorConsumo, contratosVigentes);
    lecturasMedidoresPorContrato = await this.aplyVirtualMeters(lecturasMedidoresPorContrato);
    //console.log(lecturasMedidoresPorContrato[0].vmedidor);
    ESG = await this.SumaEnergiaDeMedidores(consumoSolar, historicoMedidorConsumo);
    let lecturasManuales = await this.ObetenerLecturasManualesPorFecha(generateInvoice.fechaInicial, generateInvoice.fechaFinal, EnergiaActiva, MedidorFronteraSourceID);
    ECR = await this.LecturasMedidorFrontera(MedidorFronteraSourceID, historicoMedidorConsumo, EnergiaActiva, lecturasManuales);
    ETCU = await this.SumaEnergiaDeMedidores(consumoEEH, historicoMedidorConsumo);
    lecturasManuales = await this.ObetenerLecturasManualesPorFecha(generateInvoice.fechaInicial, generateInvoice.fechaFinal, EnergiaActivaExportada, MedidorFronteraSourceID);
    EXR = await this.LecturasMedidorFrontera(MedidorFronteraSourceID, historicoMedidorConsumo, EnergiaActivaExportada, lecturasManuales);
    //console.log('EXR: ' + EXR);
    EAC = ESG - EXR;
    FS = EAC / (ECR + EAC);
    PBE = await this.ObtenerTarifaVigente(1, generateInvoice, tarifaEnergiaExterna);
    ETO = EAC + ECR;
    // console.log('PBE: ' + PBE);
    // console.log('FS: ' + FS);
    // console.log('ESG: ' + ESG);
    // console.log('EXR: ' + EXR);
    // console.log('ECR: ' + ECR);

    lecturasMedidoresPorContrato = await this.FactorDePotencia(lecturasMedidoresPorContrato);
    lecturasMedidoresPorContrato = await this.PorcentajePenalizacionPorFP(lecturasMedidoresPorContrato);
    lecturasMedidoresPorContrato = await this.CargoPorEnergiaFotovoltaicaPorMedidor(lecturasMedidoresPorContrato, PBE, FS);
    lecturasMedidoresPorContrato = await this.ProporcionClienteFinal(lecturasMedidoresPorContrato, FS, ECR);

    if (facturaEEHVigente[0] && generateInvoice.facturaEEH === true) {
      let listadoCargos = await this.ObetenerCargosPorFactura(facturaEEHVigente[0].id);
      lecturasMedidoresPorContrato = await this.DistribucionCargosPorCliente(listadoCargos, lecturasMedidoresPorContrato, facturaEEHVigente[0].cargoReactivo);
    }
    PI = 1 - (ETCU / ETO);

    if (generateInvoice.contratoId) {
      return lecturasMedidoresPorContrato.find(element => element.contrato.contratoCodigo === generateInvoice.contratoId);
    }

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
      `${viewOf.GET_IONDATA} where (TimestampUTC = dateadd(hour,6,'${generateInvoice.fechaInicial}') or TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaFinal}')) and quantityID = ${quantityID} and sourceID != 27 ORDER BY sourceName ASC`,
    );
  }

  async getAllMetersIONDATA(generateInvoice: GenerateInvoice, quantityID: number, ListaMedidores: ION_Data_Source[]) {
    let historicoLecturas: Array<ION_Data> = [];

    for (let i = 0; i < ListaMedidores.length; i++) {
      let historicoLecturasPorMedidor: Array<ION_Data> = await this.facturaManualRepository.dataSource.execute(
        `${viewOf.GET_ALL_IONDATA} where (TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaInicial}') or TimestampUTC =  dateadd(hour,6,'${generateInvoice.fechaFinal}')) and quantityID = ${quantityID} and sourceID != 27  and sourceID = ${ListaMedidores[i].ID} ORDER BY sourceName ASC`,
      );

      // console.log('---------------------------------------------------------------------------');

      // console.log('historico encontrado: ' + historicoLecturasPorMedidor.length);
      // console.log(historicoLecturasPorMedidor);


      // console.log('---------------------------------------------------------------------------');


      for (let j = 0; j < historicoLecturasPorMedidor.length; j++) {
        if (historicoLecturasPorMedidor.length == 1) {
          //console.log('intentando manuales');

          let lecturaManualEncontrada = await this.ObtenerLecturaManualHistorica(historicoLecturasPorMedidor[j], generateInvoice, quantityID)

          if (lecturaManualEncontrada) {
            // console.log('manuales conseguidas');
            historicoLecturasPorMedidor.push(lecturaManualEncontrada);

          }

          else {
            // console.log('intentando conseguir promedio');

            // let lecturasAPromediar = await this.ObtenerValoresAPromediar(generateInvoice, historicoLecturasPorMedidor[j], quantityID);
            // // console.log(lecturasAPromediar);

            // if (lecturasAPromediar.datos) {
            //   let lecturaGenerada = await this.GenerarLecturaPromediadaTemporal(lecturasAPromediar.datos.lecturaInicial, lecturasAPromediar.datos.lecturaFinal, lecturasAPromediar.datos.fecha, lecturasAPromediar.countNulls, historicoLecturasPorMedidor[i], lecturasAPromediar.datos.posisionBuscada);
            //   historicoLecturasPorMedidor.push(lecturaGenerada);
            // }
          }


        }
        ///////////////////////////////////////////

        if (historicoLecturasPorMedidor.length > 1) {
          historicoLecturas.push(historicoLecturasPorMedidor[j]);
        }


        if (historicoLecturasPorMedidor.length == 0) {

        }


      }

      //console.log(historicoLecturas);
      //console.log(posisionBuscada);
    }
    return historicoLecturas;

  }

  async ObtenerLecturaManualHistorica(historicoLecturasPorMedidor: ION_Data, generateInvoice: GenerateInvoice, quantityID: number): Promise<ION_Data> {
    console.log(historicoLecturasPorMedidor.sourceID);

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
      `${viewOf.GET_ALL_IONDATA} where (TimestampUTC BETWEEN  dateadd(hour, - 168,'${generateInvoice.fechaInicial}') and dateadd(hour, 168,'${generateInvoice.fechaFinal}')) and quantityID = ${quantityID} and sourceID != 27 and sourceID = ${historicoLecturas.sourceID} ORDER BY sourceName ASC`,
    );

    let datos;
    let countNulls = 0;
    let QuinceMinutosMilesegundos = 900000;
    let posicionInicial: number = -1;
    let isInical: boolean = false;
    //console.log('---------------------------------------------------------------------------');
    //console.log(lecturasParaPromediar[0]);

    //console.log(lecturasParaPromediar[lecturasParaPromediar.length - 1]);
    //console.log(historicoLecturas);

    for (let k = 0; k < lecturasParaPromediar.length; k++) {
      if (lecturasParaPromediar[k].dataLog2ID === historicoLecturas.dataLog2ID) {
        posicionInicial = k;
      }
    }
    // console.log('inicial: ' + posicionInicial);

    // console.log('---------------------------------------------------------------------------');

    if (Date.parse(historicoLecturas.Fecha) > Date.parse(generateInvoice.fechaInicial)) {
      isInical = true;
    }

    for (let j = posicionInicial; j > 0; j) {


      if (Date.parse(lecturasParaPromediar[j].Fecha) <= Date.parse(historicoLecturas.Fecha) && isInical) {
        //console.log('estoy restando');
        //console.log(j);

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
      `${viewOf.GET_PT_DETAIL} WHERE estado = ${estado} and (fechaInicio >= '${data.fechaInicial}' and fechaFinal >= '${data.fechaFinal}') and tipoCargoId = ${tipoCargoId}`,
    );

    if (Tarifa) {
      return Tarifa[0] ? Tarifa[0].valor : 0;
    }

    return 0;
  }


  async identifyRollOvers(lecturasEnergiaActivaFinal: ION_Data, lecturasEnergiaActivaInicial: ION_Data, lecturasEnergiaReactivaInicial: ION_Data, lecturasEnergiaReactivaFinal: ION_Data) {

    let medidorIdentificado = await this.medidorRepository.findOne({where: {sourceId: lecturasEnergiaActivaInicial.sourceID}});
    let rollOver = await this.rollOverRepository.find({where: {medidorId: medidorIdentificado?.id}});

    if (rollOver) {
      for (let c = 0; c < rollOver.length; c++) {

        if (rollOver[c].energia === true && rollOver[c].estado === true) {
          if (Date.parse(rollOver[c].fechaInicial) <= Date.parse(lecturasEnergiaActivaFinal.Fecha) && Date.parse(rollOver[c].fechaInicial) >= Date.parse(lecturasEnergiaActivaInicial.Fecha) && medidorIdentificado?.id === rollOver[c].medidorId) {
            lecturasEnergiaActivaFinal.Value += lecturasEnergiaActivaInicial.Value;
            lecturasEnergiaActivaFinal.Value *= medidorIdentificado?.multiplicador || 1;
          }
        }

        if (rollOver[c].energia === false && rollOver[c].estado === true) {
          if (Date.parse(rollOver[c].fechaInicial) <= Date.parse(lecturasEnergiaReactivaFinal.Fecha) && Date.parse(rollOver[c].fechaInicial) >= Date.parse(lecturasEnergiaReactivaInicial.Fecha) && medidorIdentificado?.id === rollOver[c].medidorId) {
            //console.log(lecturasEnergiaReactivaFinal.Value + ' + ' + lecturasEnergiaReactivaInicial.Value + ' = ');

            lecturasEnergiaReactivaFinal.Value += lecturasEnergiaReactivaInicial.Value;
            lecturasEnergiaActivaFinal.Value *= medidorIdentificado?.multiplicador || 1;
          }

        }
      }

    }

    return {
      sourceId: lecturasEnergiaActivaFinal.sourceID,
      descripcion: medidorIdentificado?.descripcion,
      LecturaActivaFinal: lecturasEnergiaActivaFinal.Value - lecturasEnergiaActivaInicial.Value,
      LecturaReactivaFinal: lecturasEnergiaReactivaFinal.Value - lecturasEnergiaReactivaInicial.Value,
      lecturaActivaActual: lecturasEnergiaActivaFinal.Value,
      lecturaActivaAnterior: lecturasEnergiaActivaInicial.Value,
      lecturaReactivaActual: lecturasEnergiaReactivaFinal.Value,
      lecturaReactivaAnterior: lecturasEnergiaReactivaInicial.Value,
      multiplicador: medidorIdentificado?.multiplicador,
    }


  }

  async aplyVirtualMeters(lecturasEnergiaActivaFinal: LecturasPorContrato[]) {
    let resta = false, suma = true;
    for (let i = 0; i < lecturasEnergiaActivaFinal.length; i++) {
      for (let j = 0; j < lecturasEnergiaActivaFinal[i].medidor.length; j++) {

        let medidorIdentificado = await this.medidorRepository.findOne({where: {sourceId: lecturasEnergiaActivaFinal[i].medidor[j].sourceID}});
        let medidoresVirtualesRelacionados = await this.medidorVirtualDetalleRepository.find({where: {medidorId: medidorIdentificado?.id}});
        //console.log(medidoresVirtualesRelacionados);


        if (medidoresVirtualesRelacionados.length > 0) {
          for (let m = 0; m < medidoresVirtualesRelacionados.length; m++) {
            let medidoresVirutalesIdentificados = await this.medidorVirtualRepository.findOne({where: {id: medidoresVirtualesRelacionados[m].vmedidorId}});

            if (medidoresVirutalesIdentificados) {

              if (medidoresVirutalesIdentificados.operacion === resta && medidoresVirtualesRelacionados[m].estado) {
                if (!lecturasEnergiaActivaFinal[i].vmedidor) {
                  lecturasEnergiaActivaFinal[i].vmedidor = [{
                    descripcion: medidoresVirutalesIdentificados.observacion || '',
                    LecturaActiva: - lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva * medidoresVirutalesIdentificados.porcentaje,
                    LecturaReactiva: - lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                    porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                  }
                  ];

                } else {
                  lecturasEnergiaActivaFinal[i].vmedidor?.push({
                    descripcion: medidoresVirutalesIdentificados.observacion || '',
                    LecturaActiva: - lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva * medidoresVirutalesIdentificados.porcentaje,
                    LecturaReactiva: - lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                    porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                  });

                }

                lecturasEnergiaActivaFinal[i].totalLecturaActivaAjustada -= lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva;
                lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva -= (lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva * medidoresVirutalesIdentificados.porcentaje);
                lecturasEnergiaActivaFinal[i].totalLecturaActivaAjustada += lecturasEnergiaActivaFinal[i].medidor[j].LecturaActiva;

                lecturasEnergiaActivaFinal[i].totalLecturaReactivaAjustada -= lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva;
                lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva -= (lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje);
                lecturasEnergiaActivaFinal[i].totalLecturaReactivaAjustada += lecturasEnergiaActivaFinal[i].medidor[j].LecturaReactiva;

              }


              if (medidoresVirutalesIdentificados.operacion === suma && medidoresVirtualesRelacionados[m].estado === true && medidoresVirtualesRelacionados[m].sourceId) {

                for (let h = 0; h < lecturasEnergiaActivaFinal.length; h++) {
                  for (let l = 0; l < lecturasEnergiaActivaFinal[h].medidor.length; l++) {
                    if (lecturasEnergiaActivaFinal[h].medidor[l].sourceID === medidoresVirtualesRelacionados[m].sourceId) {

                      if (!lecturasEnergiaActivaFinal[h].vmedidor) {
                        lecturasEnergiaActivaFinal[h].vmedidor = [{
                          descripcion: medidoresVirutalesIdentificados.observacion || '',
                          LecturaActiva: - lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje,
                          LecturaReactiva: - lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                          porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                        }
                        ];

                      } else {
                        lecturasEnergiaActivaFinal[h].vmedidor?.push({
                          descripcion: medidoresVirutalesIdentificados.observacion || '',
                          LecturaActiva: - lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje,
                          LecturaReactiva: - lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                          porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                        });
                      }


                      if (!lecturasEnergiaActivaFinal[i].vmedidor) {
                        lecturasEnergiaActivaFinal[i].vmedidor = [{
                          descripcion: medidoresVirutalesIdentificados.observacion || '',
                          LecturaActiva: lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje,
                          LecturaReactiva: lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
                          porcentaje: medidoresVirutalesIdentificados.porcentaje * 100
                        }
                        ];

                      } else {
                        lecturasEnergiaActivaFinal[i].vmedidor?.push({
                          descripcion: medidoresVirutalesIdentificados.observacion || '',
                          LecturaActiva: lecturasEnergiaActivaFinal[h].medidor[l].LecturaActiva * medidoresVirutalesIdentificados.porcentaje,
                          LecturaReactiva: lecturasEnergiaActivaFinal[h].medidor[l].LecturaReactiva * medidoresVirutalesIdentificados.porcentaje,
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

  async LecturasAjustadas(lecturasEnergiaActiva: ION_Data[], lecturasEnergiaReactiva: ION_Data[], medidores: any) {
    let i = 0;
    let historicoMedidorConsumo: Array<MedidorSelect> = []

    for (let j = 0; j < lecturasEnergiaActiva.length; j += 2) {
      let auxActiva = lecturasEnergiaActiva[j + 1].Value;
      let auxReactiva = lecturasEnergiaReactiva[j + 1].Value;


      let resultadoRollOver = await this.identifyRollOvers(lecturasEnergiaActiva[j + 1], lecturasEnergiaActiva[j], lecturasEnergiaReactiva[j], lecturasEnergiaReactiva[j + 1]);


      if (lecturasEnergiaActiva[j].sourceID === medidores[i].ID && lecturasEnergiaActiva[j].sourceID === medidores[i].ID && lecturasEnergiaReactiva[j].sourceID === medidores[i].ID) {
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
    return historicoMedidorConsumo;
  }



  async metersOnContract(today: string) {
    let contratosVigentes = this.medidorRepository.dataSource.execute(
      `${viewOf.GET_CMETERS} where estado = 1 and fechaCreacion < '${today}' and fechaVenc > '${today}'  and tipoContratoId = 3`,
    );

    return contratosVigentes;
  }

  async ObetenerLecturasManualesPorFecha(fechaInicial: string, fechaFinal: string, quantityID: number, sourceID: number) {
    let lecturasManuales = this.medidorRepository.dataSource.execute(
      `${viewOf.GET_MANUAL_REGISTERS_FOR_DATE} where sourceId = ${sourceID} and (fecha = '${fechaInicial}' or fecha = '${fechaFinal}') and quantityId = ${quantityID}`,
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
                  descripcion: lecturasMedidores[i].descripcion || '',
                  sourceName: lecturasMedidores[i].sourceName,
                  LecturaActiva: lecturasMedidores[i].totalLecturaActiva,
                  LecturaReactiva: lecturasMedidores[i].totalLecturaReactiva,
                  CEF: 0,
                  PCF: 0,
                  FP: 0,
                  PCFR: 0,
                  historico: {
                    fechaActual: lecturasMedidores[i].fechaActual,
                    fechaAnterior: lecturasMedidores[i].fechaAnterior,
                    lecturaActivaActual: lecturasMedidores[i].lecturaActivaActual,
                    lecturaActivaAnterior: lecturasMedidores[i].lecturaActivaAnterior,
                    lecturaReactivaActual: lecturasMedidores[i].lecturaReactivaActual,
                    lecturaReactivaAnterior: lecturasMedidores[i].lecturaReactivaAnterior,
                    multiplicador: lecturasMedidores[i].multiplicador,
                  }
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
                CEF: 0,
                PCF: 0,
                FP: 0,
                PCFR: 0,
                historico: {
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
              CEFTotal: 0,
              PCFTotal: 0,
              PCFRTotal: 0,
              FPTotal: 0
            });

          }
        }
      }
    }

    //  console.log(LecturasResultantes);

    return LecturasResultantes;
  }

  async SumaEnergiaDeMedidores(listaMedidores: ION_Data_Source[], LecturasPorMedidor: MedidorSelect[]) {
    let TotalEnergia = 0;

    if (LecturasPorMedidor.length > 0)
      for (let i = 0; i < listaMedidores.length; i++) {
        for (let j = 0; j < LecturasPorMedidor.length; j++) {
          if (listaMedidores[i].Name === LecturasPorMedidor[j].sourceName) {
            TotalEnergia += LecturasPorMedidor[j].totalLecturaActiva;
          }
        }
      }

    return TotalEnergia;
  }

  async LecturasMedidorFrontera(MedidorFronteraSourceID: number, LecturasPorMedidor: MedidorSelect[], quantityID: number, lecturasManuales: any[]) {
    let LecturasFrontera = 0;
    for (let i = 0; i < LecturasPorMedidor.length; i++) {
      if (LecturasPorMedidor[i].sourceId === MedidorFronteraSourceID && LecturasPorMedidor[i].quantityID === quantityID) {
        LecturasFrontera += LecturasPorMedidor[i].totalLecturaActiva;
      }
    }
    if (LecturasFrontera == 0) {
      if (lecturasManuales.length > 1) {
        LecturasFrontera = (lecturasManuales[1].valor * lecturasManuales[0].multiplicador) - (lecturasManuales[0].valor * lecturasManuales[0].multiplicador);
      }
    }
    //console.log(LecturasFrontera);
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

  async DistribucionCargosPorCliente(listadoCargos: CargosFacturaEEH[], listadoContratosMedidor: LecturasPorContrato[], cargoReactivo: number) {
    for (let i = 0; i < listadoContratosMedidor.length; i++) {
      let total = 0;
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
        total += listadoCargos[j].valor * listadoContratosMedidor[i].PCFTotal;
      }


      listadoContratosMedidor[i].cargo?.push({
        nombre: 'Cargo por energia fotovoltaica',
        valorAjustado: listadoContratosMedidor[i].CEFTotal,
      });

      listadoContratosMedidor[i].cargo?.push({
        nombre: 'Cargo Reactivo',
        valorAjustado: listadoContratosMedidor[i].PCFRTotal * cargoReactivo,
      });

      //console.log(listadoContratosMedidor[i].PCFRTotal * cargoReactivo);

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
        listadoContratosMedidor[i].medidor[j].FP = (listadoContratosMedidor[i].medidor[j].LecturaActiva) / Math.sqrt(Math.pow(listadoContratosMedidor[i].medidor[j].LecturaActiva, 2) + Math.pow(listadoContratosMedidor[i].medidor[j].LecturaReactiva, 2));
        listadoContratosMedidor[i].FPTotal += listadoContratosMedidor[i].medidor[j].FP;
        //console.log('resultado: ' + listadoContratosMedidor[i].medidor[j].FP);

        //console.log(listadoContratosMedidor[i].medidor[j].FP);

      }
      listadoContratosMedidor[i].FPTotal /= listadoContratosMedidor[i].medidor.length;
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



