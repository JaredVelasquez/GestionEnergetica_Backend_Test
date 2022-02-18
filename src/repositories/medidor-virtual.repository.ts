import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {MedidorVirtual, MedidorVirtualRelations} from '../models';

export class MedidorVirtualRepository extends DefaultCrudRepository<
  MedidorVirtual,
  typeof MedidorVirtual.prototype.id,
  MedidorVirtualRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(MedidorVirtual, dataSource);
  }
}
