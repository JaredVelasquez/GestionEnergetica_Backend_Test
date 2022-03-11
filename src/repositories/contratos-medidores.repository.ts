import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {ContratosMedidores, ContratosMedidoresRelations} from '../models';

export class ContratosMedidoresRepository extends DefaultCrudRepository<
  ContratosMedidores,
  typeof ContratosMedidores.prototype.id,
  ContratosMedidoresRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(ContratosMedidores, dataSource);
  }
}
