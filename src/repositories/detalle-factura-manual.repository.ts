import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {DetalleFacturaManual, DetalleFacturaManualRelations} from '../models';

export class DetalleFacturaManualRepository extends DefaultCrudRepository<
  DetalleFacturaManual,
  typeof DetalleFacturaManual.prototype.id,
  DetalleFacturaManualRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(DetalleFacturaManual, dataSource);
  }
}
