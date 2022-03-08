import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'TipoCargo'}}})
export class TipoCargo extends Entity {
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
    required: true,
    length: 50,
    mssql: {columnName: 'codigo', dataType: 'varchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  codigo: string;

  @property({
    type: 'string',
    length: 250,
    mssql: {columnName: 'nombre', dataType: 'varchar', dataLength: 250, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  nombre?: string;

  @property({
    type: 'string',
    length: 50,
    mssql: {columnName: 'unidad', dataType: 'varchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  unidad?: string;

  @property({
    type: 'boolean',
    mssql: {columnName: 'estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  estado?: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TipoCargo>) {
    super(data);
  }
}

export interface TipoCargoRelations {
  // describe navigational properties here
}

export type TipoCargoWithRelations = TipoCargo & TipoCargoRelations;
