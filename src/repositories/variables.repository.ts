import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Variables, VariablesRelations} from '../models';

export class VariablesRepository extends DefaultCrudRepository<
  Variables,
  typeof Variables.prototype.id,
  VariablesRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(Variables, dataSource);
  }
}
