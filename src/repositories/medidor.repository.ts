import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Medidor, MedidorRelations} from '../models';

export class MedidorRepository extends DefaultCrudRepository<
  Medidor,
  typeof Medidor.prototype.id,
  MedidorRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(Medidor, dataSource);
  }
}
