import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {CargosFactura, CargosFacturaRelations} from '../models';

export class CargosFacturaRepository extends DefaultCrudRepository<
  CargosFactura,
  typeof CargosFactura.prototype.id,
  CargosFacturaRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(CargosFactura, dataSource);
  }
}
