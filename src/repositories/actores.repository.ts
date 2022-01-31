import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Actores, ActoresRelations} from '../models';

export class ActoresRepository extends DefaultCrudRepository<
  Actores,
  typeof Actores.prototype.id,
  ActoresRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(Actores, dataSource);
  }
}
