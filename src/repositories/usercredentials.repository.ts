import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Usercredentials, UsercredentialsRelations} from '../models';

export class UsercredentialsRepository extends DefaultCrudRepository<
  Usercredentials,
  typeof Usercredentials.prototype.id,
  UsercredentialsRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(Usercredentials, dataSource);
  }
}
