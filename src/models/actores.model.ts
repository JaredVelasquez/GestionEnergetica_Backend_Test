import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Actores'}}})
export class Actores extends Entity {
  @property({
    type: 'number',
    required: false,
    precision: 10,
    scale: 0,
    id: 1,
    mssql: {columnName: 'Id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    length: 50,
    mssql: {columnName: 'Codigo', dataType: 'varchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  codigo: string;

  @property({
    type: 'string',
    required: true,
    mssql: {columnName: 'TipoActor', dataType: 'varchar', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  tipoActor: string;

  @property({
    type: 'string',
    length: 250,
    mssql: {columnName: 'Imagen', dataType: 'varchar', dataLength: 250, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  imagen?: string;

  @property({
    type: 'string',
    length: -1,
    mssql: {columnName: 'Observacion', dataType: 'varchar', dataLength: -1, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  observacion?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Actores>) {
    super(data);
  }
}

export interface ActoresRelations {
  // describe navigational properties here
}

export type ActoresWithRelations = Actores & ActoresRelations;
