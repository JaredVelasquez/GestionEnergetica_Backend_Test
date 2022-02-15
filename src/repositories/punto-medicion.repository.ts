import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {PuntoMedicion, PuntoMedicionRelations} from '../models';

export class PuntoMedicionRepository extends DefaultCrudRepository<
  PuntoMedicion,
  typeof PuntoMedicion.prototype.id,
  PuntoMedicionRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(PuntoMedicion, dataSource);
  }
}
