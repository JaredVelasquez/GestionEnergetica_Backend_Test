import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, mssql: {schema: 'dbo', table: 'usercredentials'}}
})
export class Usercredentials extends Entity {
  @property({
    type: 'number',
    required: false,
    precision: 10,
    scale: 0,
    id: 1,
    mssql: {columnName: 'id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  id?: number;

  @property({
    type: 'string',
    length: 50,
    mssql: {columnName: 'username', dataType: 'nvarchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  username?: string;

  @property({
    type: 'string',
    length: 50,
    mssql: {columnName: 'email', dataType: 'nvarchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  email?: string;

  @property({
    type: 'string',
    length: 500,
    mssql: {columnName: 'hash', dataType: 'varchar', dataLength: 500, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  hash?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Usercredentials>) {
    super(data);
  }
}

export interface UsercredentialsRelations {
  // describe navigational properties here
}

export type UsercredentialsWithRelations = Usercredentials & UsercredentialsRelations;
