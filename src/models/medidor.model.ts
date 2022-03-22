import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Medidor'}}})
export class Medidor extends Entity {
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
    length: 100,
    mssql: {columnName: 'sourceId', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  sourceId?: string;

  @property({
    type: 'string',
    length: 100,
    mssql: {columnName: 'Codigo', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  codigo?: string;

  @property({
    type: 'string',
    length: 100,
    mssql: {columnName: 'Descripcion', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  descripcion?: string;

  @property({
    type: 'string',
    length: 100,
    mssql: {columnName: 'Modelo', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  modelo?: string;

  @property({
    type: 'string',
    length: 100,
    mssql: {columnName: 'Serie', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  serie?: string;

  @property({
    type: 'number',
    precision: 53,
    mssql: {columnName: 'LecturaMax', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES'},
  })
  lecturaMax?: number;

  @property({
    type: 'number',
    precision: 53,
    mssql: {columnName: 'Multiplicador', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES'},
  })
  multiplicador?: number;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    mssql: {columnName: 'PuntoMedicionId', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO'},
  })
  puntoMedicionId: number;

  @property({
    type: 'string',
    length: -1,
    mssql: {columnName: 'Observacion', dataType: 'varchar', dataLength: -1, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  observacion?: string;

  @property({
    type: 'boolean',
    mssql: {columnName: 'Tipo', dataType: 'int', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES'},
  })
  tipo?: number;

  @property({
    type: 'boolean',
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
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
