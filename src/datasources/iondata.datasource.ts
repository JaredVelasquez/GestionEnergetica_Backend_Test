import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'IONDATA',
  connector: 'mssql',
  url: 'mssql://sa:1234@IT-JVELASQUEZ/ION_Data',
  host: 'IT-JVELASQUEZ',
  port: 1433,
  user: 'sa',
  password: '1234',
  database: 'ION_Data'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class IondataDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'IONDATA';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.IONDATA', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
