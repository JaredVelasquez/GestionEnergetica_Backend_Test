import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Medidor'}}})
export class Medidor extends Entity {
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
    type: 'number',
    precision: 10,
    scale: 0,
    mssql: {columnName: 'sourceId', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  sourceId?: number;

  @property({
    type: 'string',
    length: 100,
    mssql: {columnName: 'codigo', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  codigo?: string;

  @property({
    type: 'string',
    length: 100,
    mssql: {columnName: 'descripcion', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  descripcion?: string;

  @property({
    type: 'string',
    length: 100,
    mssql: {columnName: 'modelo', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  modelo?: string;

  @property({
    type: 'string',
    length: 100,
    mssql: {columnName: 'serie', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  serie?: string;

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    mssql: {columnName: 'multiplicador', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  multiplicador: number;

  @property({
    type: 'number',
    precision: 53,
    mssql: {columnName: 'lecturaMax', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES'},
  })
  lecturaMax?: number;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    mssql: {columnName: 'puntoMedicionId', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO'},
  })
  puntoMedicionId: number;

  @property({
    type: 'string',
    length: -1,
    mssql: {columnName: 'observacion', dataType: 'varchar', dataLength: -1, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  observacion?: string;

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    mssql: {columnName: 'puntoConexion', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  puntoConexion?: number;

  @property({
    type: 'boolean',
    mssql: {columnName: 'tipo', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  tipo?: boolean;

  @property({
    type: 'boolean',
    mssql: {columnName: 'registroDatos', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  registroDatos?: boolean;

  @property({
    type: 'boolean',
    mssql: {columnName: 'almacenamientoLocal', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  almacenamientoLocal?: boolean;

  @property({
    type: 'boolean',
    mssql: {columnName: 'funcionalidad', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  funcionalidad?: boolean;

  @property({
    type: 'boolean',
    mssql: {columnName: 'estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  estado?: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Medidor>) {
    super(data);
  }
}

export interface MedidorRelations {
  // describe navigational properties here
}

export type MedidorWithRelations = Medidor & MedidorRelations;
