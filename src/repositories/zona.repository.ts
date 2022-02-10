import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Zona, ZonaRelations} from '../models';

export class ZonaRepository extends DefaultCrudRepository<
  Zona,
  typeof Zona.prototype.id,
  ZonaRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(Zona, dataSource);
  }
}
