import { /* inject, */ BindingScope, injectable} from '@loopback/core/dist';
import {repository} from '@loopback/repository';
import {InvoicesInterface} from '../core/interfaces/models/invoices.interface';
import {CargosFacturaRepository, ContratosMedidoresRepository, DetalleFacturaRepository, FacturaRepository, MedidorRepository, MedidorVirtualRepository, ParametroTarifaRepository, TarifaParametroDetalleRepository} from '../repositories';

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
    private cargosFacturaRepository: CargosFacturaRepository,
    @repository(MedidorRepository)
    private medidorRepository: MedidorRepository,
    @repository(MedidorVirtualRepository)
    private medidorVirtualRepository: MedidorVirtualRepository
  ) { }

  async CreateInvoice(invoice: InvoicesInterface) {

    if (!invoice)
      return {error: 'Objeto invoice vacio'};

    let newInvoice = {
      contratoId: invoice.contratoId,
      codigo: invoice.codigo,
      fechaLectura: invoice.fechaLectura,
      fechaVencimiento: invoice.fechaVencimiento,
      fechaEmision: invoice.fechaEmision,
      fechaInicio: invoice.fechaInicio,
      fechaFin: invoice.fechaFin,
      estado: invoice.estado,

    }
    let InvoiceCreated = await this.facturaRepository.create(newInvoice);
    await this.facturaRepository.updateById(InvoiceCreated.id, {codigo: InvoiceCreated.codigo + String(InvoiceCreated.id)});

    if (!InvoiceCreated) {
      return {error: "No fue posible emitir la factura"};
    }

    let newDetailInoice = {
      facturaId: InvoiceCreated.id,
      energiaConsumida: invoice.energiaConsumida,
      total: invoice.total,
      estado: 2
    }

    let invoiceDatailCreated = await this.detalleFacturaRepository.create(newDetailInoice);


    return invoiceDatailCreated;
  }

}
