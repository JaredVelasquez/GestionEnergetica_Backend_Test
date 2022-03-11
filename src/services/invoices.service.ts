import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {InvoicesInterface} from '../core/interfaces/models/invoices.interface';
import {CargosFacturaRepository, DetalleFacturaRepository, FacturaRepository, ParametroTarifaRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class InvoicesService {
  constructor(
    @repository(FacturaRepository)
    private facturaRepository: FacturaRepository,
    @repository(DetalleFacturaRepository)
    private detalleFacturaRepository: DetalleFacturaRepository,
    @repository(CargosFacturaRepository)
    private cargosFacturaRepository: CargosFacturaRepository,
    @repository(ParametroTarifaRepository)
    private parametroTarifaRepository: ParametroTarifaRepository
  ) { }

  async CreateInvoice(invoice: InvoicesInterface) {
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
    let InvoiceCreated = await this.facturaRepository.create(newInvoice);

    if (!InvoiceCreated)
      return "Error: No fue posible crear la factura";

    let cargoAsigned = await this.cargosFacturaRepository.findById(invoice.cargoId);

    if (!cargoAsigned)
      return "Error: No fue posible encontrar el cargo asignado.";

    let paramTarifa = await this.parametroTarifaRepository.findById(invoice.parametroTarifaId);

    if (!paramTarifa)
      return "Error: tarifa no existe.";

    let newDetailInoice = {
      facturaId: InvoiceCreated.id,
      cargoFacturaId: cargoAsigned.id,
      energiaConsumida: invoice.energiaConsumida,
      total: invoice.energiaConsumida * paramTarifa.valor,
    }

    let invoiceDatailCreated = await this.detalleFacturaRepository.create(newDetailInoice);


    return invoiceDatailCreated;
  }

}
