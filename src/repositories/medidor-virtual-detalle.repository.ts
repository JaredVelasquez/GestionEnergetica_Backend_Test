import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {MedidorVirtualDetalle, MedidorVirtualDetalleRelations} from '../models';

export class MedidorVirtualDetalleRepository extends DefaultCrudRepository<
  MedidorVirtualDetalle,
  typeof MedidorVirtualDetalle.prototype.id,
  MedidorVirtualDetalleRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(MedidorVirtualDetalle, dataSource);
  }
}
