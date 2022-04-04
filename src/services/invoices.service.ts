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
    let cargoAsigned;
    let energiaConsumidaAjustada = invoice.energiaConsumida;

    if (!invoice)
      return 'Objeto invoice vacio';

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
    cargoAsigned = await this.cargosFacturaRepository.findById(invoice.cargoId);

    if (!cargoAsigned)
      return "No hay cargo asignable";

    let ContratoMedidor = await this.contratosMedidoresRepository.findById(invoice.contratoMedidorId);

    if (!ContratoMedidor)
      return 'No hay un contrato de medidor relacionado';

    let tarifaRelation = await this.tarifaParametroDetalleRepository.findById(ContratoMedidor.tarifaId);

    let tarifa = await this.parametroTarifaRepository.findOne({where: {Id: tarifaRelation.parametroId}});

    if (!tarifa)
      return 'error';

    let InvoiceCreated = await this.facturaRepository.create(newInvoice);

    if (!InvoiceCreated)
      return "Error: No fue posible crear la factura";

    let ListOfVirtualMeters = await this.medidorVirtualRepository.find({where: {medidorId: ContratoMedidor.medidorId}});


    if (ListOfVirtualMeters) {
      for (let i = 0; i < ListOfVirtualMeters.length; i++) {
        if (ListOfVirtualMeters[i].operacion === true) {
          energiaConsumidaAjustada = energiaConsumidaAjustada + (invoice.energiaConsumida * ListOfVirtualMeters[i].porcentaje);
        } else {
          energiaConsumidaAjustada = energiaConsumidaAjustada - (invoice.energiaConsumida * ListOfVirtualMeters[i].porcentaje);

        }
      }
    }
    let newDetailInoice = {
      facturaId: InvoiceCreated.id,
      cargoFacturaId: invoice.cargoId,
      energiaConsumida: invoice.energiaConsumida,
      total: (energiaConsumidaAjustada * tarifa?.valor) - cargoAsigned.totalCargos
    }

    let invoiceDatailCreated = await this.detalleFacturaRepository.create(newDetailInoice);


    return invoiceDatailCreated;
  }

}
