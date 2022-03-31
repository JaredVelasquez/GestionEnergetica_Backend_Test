import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {meterRelationSchema, meterSchema} from '../core/interfaces/models/meter.interface';
import {MedidorRepository, MedidorVirtualDetalleRepository, MedidorVirtualRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class MeterService {
  constructor(
    @repository(MedidorRepository)
    private meterRespository: MedidorRepository,
    @repository(MedidorVirtualRepository)
    private virtualmeterRespository: MedidorVirtualRepository,
    @repository(MedidorVirtualDetalleRepository)
    private meterVirtualDetailRepository: MedidorVirtualDetalleRepository,
  ) { }

  async registerMeter(meter: meterSchema) {
    return await this.meterRespository.create(meter);
  }

  async registerVirtualMeter(vmeter: meterRelationSchema) {
    const {medidorId, porcentaje, operacion, observacion, estado} = vmeter;

    let newVirtualMeter = await this.virtualmeterRespository.create({medidorId, porcentaje, operacion, observacion, estado});

    if (!newVirtualMeter)
      return "error al crear medidor virutal.";

    let relation = {
      medidorId: vmeter.medidorId,
      vmedidorId: newVirtualMeter.id,
      estado: true
    }

    let newRelationMeter = await this.meterVirtualDetailRepository.create(relation);

    if (!newRelationMeter)
      return "error al crear relacion medidores.";

    let result = {
      id: newRelationMeter.id,
      medidorId: vmeter.medidorId,
      operacion: vmeter.operacion,
      porcentaje: vmeter.porcentaje,
      observacion: vmeter.observacion,
      estado: vmeter.estado,
    }

    return result;
  }
}
