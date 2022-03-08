import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {TarifaParametroDetalle, TarifaParametroDetalleRelations} from '../models';

export class TarifaParametroDetalleRepository extends DefaultCrudRepository<
  TarifaParametroDetalle,
  typeof TarifaParametroDetalle.prototype.id,
  TarifaParametroDetalleRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(TarifaParametroDetalle, dataSource);
  }
}
