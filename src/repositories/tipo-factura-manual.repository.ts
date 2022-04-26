import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {TipoFacturaManual, TipoFacturaManualRelations} from '../models';

export class TipoFacturaManualRepository extends DefaultCrudRepository<
  TipoFacturaManual,
  typeof TipoFacturaManual.prototype.id,
  TipoFacturaManualRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(TipoFacturaManual, dataSource);
  }
}
