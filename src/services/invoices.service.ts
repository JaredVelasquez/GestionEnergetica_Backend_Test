import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {InvoicesInterface} from '../core/interfaces/models/invoices.interface';
import {CargosFacturaRepository, ContratosMedidoresRepository, DetalleFacturaRepository, FacturaRepository, ParametroTarifaRepository, TarifaParametroDetalleRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class InvoicesService {
  constructor(
    @repository(FacturaRepository)
    private facturaRepository: FacturaRepository,
    @repository(DetalleFacturaRepository)
    private detalleFacturaRepository: DetalleFacturaRepository,
    @repository(ContratosMedidoresRepository)
    private contratosMedidoresRepository: ContratosMedidoresRepository,
    @repository(TarifaParametroDetalleRepository)
    private tarifaParametroDetalleRepository: TarifaParametroDetalleRepository,
    @repository(ParametroTarifaRepository)
    private parametroTarifaRepository: ParametroTarifaRepository,
    @repository(CargosFacturaRepository)
    private cargosFacturaRepository: CargosFacturaRepository
  ) { }

  async CreateInvoice(invoice: InvoicesInterface) {
    let cargoAsigned;
    let newInvoice = {
      contratoMedidorId: invoice.contratoMedidorId,
      codigo: invoice.codigo,
      fechaLectura: invoice.fechaLectura,
      fechaVencimiento: invoice.fechaVencimiento,
      fechaInicio: invoice.fechaInicio,
      fechaFin: invoice.fechaFin,
      tipoConsumo: invoice.tipoConsumo,
      observacion: invoice.observacion,
      estado: invoice.estado,

    }
    console.log(invoice);

    cargoAsigned = await this.cargosFacturaRepository.findById(invoice.cargoId);

    if (!cargoAsigned) {
      cargoAsigned = {
        totalCargos: 0,
      }

    }

    if (!cargoAsigned.totalCargos)
      return 'no hay cargos asignables';

    let InvoiceCreated = await this.facturaRepository.create(newInvoice);

    if (!InvoiceCreated)
      return "Error: No fue posible crear la factura";

    let ContratoMedidor = await this.contratosMedidoresRepository.findById(invoice.contratoMedidorId);

    let tarifaRelation = await this.tarifaParametroDetalleRepository.findById(ContratoMedidor.tarifaId);

    let tarifa = await this.parametroTarifaRepository.findOne({where: {Id: tarifaRelation.parametroId}});

    if (!tarifa)
      return 'error';



    let newDetailInoice = {
      facturaId: InvoiceCreated.id,
      cargoFacturaId: invoice.cargoId,
      energiaConsumida: invoice.energiaConsumida,
      total: invoice.energiaConsumida * tarifa?.valor + cargoAsigned.totalCargos
    }

    let invoiceDatailCreated = await this.detalleFacturaRepository.create(newDetailInoice);


    return invoiceDatailCreated;
  }

}
