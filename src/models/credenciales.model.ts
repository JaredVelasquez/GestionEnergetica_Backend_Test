import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'credenciales'}}})
export class Credenciales extends Entity {
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
    length: 255,
    mssql: {columnName: 'Correo', dataType: 'varchar', dataLength: 255, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  correo?: string;

  @property({
    type: 'string',
    length: 255,
    mssql: {columnName: 'Username', dataType: 'varchar', dataLength: 255, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  username?: string;

  @property({
    type: 'string',
    length: 255,
    mssql: {columnName: 'Hash', dataType: 'varchar', dataLength: 255, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  hash?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Credenciales>) {
    super(data);
  }
}

export interface CredencialesRelations {
  // describe navigational properties here
}

export type CredencialesWithRelations = Credenciales & CredencialesRelations;
