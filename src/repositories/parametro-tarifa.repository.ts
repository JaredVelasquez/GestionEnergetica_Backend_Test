import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {ParametroTarifa, ParametroTarifaRelations} from '../models';

export class ParametroTarifaRepository extends DefaultCrudRepository<
  ParametroTarifa,
  typeof ParametroTarifa.prototype.id,
  ParametroTarifaRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(ParametroTarifa, dataSource);
  }
}
