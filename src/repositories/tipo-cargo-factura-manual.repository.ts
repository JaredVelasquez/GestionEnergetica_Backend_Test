import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {TipoCargoFacturaManual, TipoCargoFacturaManualRelations} from '../models';

export class TipoCargoFacturaManualRepository extends DefaultCrudRepository<
  TipoCargoFacturaManual,
  typeof TipoCargoFacturaManual.prototype.id,
  TipoCargoFacturaManualRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(TipoCargoFacturaManual, dataSource);
  }
}
