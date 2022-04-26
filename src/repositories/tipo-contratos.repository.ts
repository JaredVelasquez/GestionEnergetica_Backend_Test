import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {TipoContratos, TipoContratosRelations} from '../models';

export class TipoContratosRepository extends DefaultCrudRepository<
  TipoContratos,
  typeof TipoContratos.prototype.id,
  TipoContratosRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(TipoContratos, dataSource);
  }
}
