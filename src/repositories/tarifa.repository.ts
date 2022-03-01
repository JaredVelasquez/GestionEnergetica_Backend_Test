import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Tarifa, TarifaRelations} from '../models';

export class TarifaRepository extends DefaultCrudRepository<
  Tarifa,
  typeof Tarifa.prototype.id,
  TarifaRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(Tarifa, dataSource);
  }
}
