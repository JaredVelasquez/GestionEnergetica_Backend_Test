import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IondataDataSource} from '../datasources';
import {DataLog2, DataLog2Relations} from '../models';

export class DataLog2Repository extends DefaultCrudRepository<
  DataLog2,
  typeof DataLog2.prototype.id,
  DataLog2Relations
> {
  constructor(
    @inject('datasources.IONDATA') dataSource: IondataDataSource,
  ) {
    super(DataLog2, dataSource);
  }
}
