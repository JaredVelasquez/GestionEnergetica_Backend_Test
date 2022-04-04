import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {RegistroManual, RegistroManualRelations} from '../models';

export class RegistroManualRepository extends DefaultCrudRepository<
  RegistroManual,
  typeof RegistroManual.prototype.id,
  RegistroManualRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(RegistroManual, dataSource);
  }
}
