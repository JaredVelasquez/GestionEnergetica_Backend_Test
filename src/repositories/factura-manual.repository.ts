import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {FacturaManual, FacturaManualRelations} from '../models';

export class FacturaManualRepository extends DefaultCrudRepository<
  FacturaManual,
  typeof FacturaManual.prototype.id,
  FacturaManualRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(FacturaManual, dataSource);
  }
}
