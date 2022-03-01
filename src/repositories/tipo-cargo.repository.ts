import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {TipoCargo, TipoCargoRelations} from '../models';

export class TipoCargoRepository extends DefaultCrudRepository<
  TipoCargo,
  typeof TipoCargo.prototype.id,
  TipoCargoRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(TipoCargo, dataSource);
  }
}
