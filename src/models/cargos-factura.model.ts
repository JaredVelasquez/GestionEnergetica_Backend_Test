import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'CargosFactura'}}})
export class CargosFactura extends Entity {
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
    type: 'date',
    mssql: {columnName: 'fechaInicio', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  fechaInicio?: string;

  @property({
    type: 'date',
    mssql: {columnName: 'fechaFinal', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  fechaFinal?: string;

  @property({
    type: 'string',
    length: -1,
    mssql: {columnName: 'descripcion', dataType: 'varchar', dataLength: -1, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  descripcion?: string;

  @property({
    type: 'number',
    precision: 53,
    mssql: {columnName: 'cargoFinanciamiento', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES'},
  })
  cargoFinanciamiento?: number;

  @property({
    type: 'number',
    precision: 53,
    mssql: {columnName: 'ajuste', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES'},
  })
  ajuste?: number;

  @property({
    type: 'number',
    precision: 53,
    mssql: {columnName: 'cargoCorte', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES'},
  })
  cargoCorte?: number;

  @property({
    type: 'number',
    precision: 53,
    mssql: {columnName: 'cargoMora', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES'},
  })
  cargoMora?: number;

  @property({
    type: 'number',
    precision: 53,
    mssql: {columnName: 'otrosCargos', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES'},
  })
  otrosCargos?: number;

  @property({
    type: 'number',
    precision: 53,
    mssql: {columnName: 'totalCargos', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'NO'},
  })
  totalCargos: number;

  @property({
    type: 'string',
    length: -1,
    mssql: {columnName: 'observacion', dataType: 'nvarchar', dataLength: -1, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  observacion?: string;

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    mssql: {columnName: 'estado', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  estado?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<CargosFactura>) {
    super(data);
  }
}

export interface CargosFacturaRelations {
  // describe navigational properties here
}

export type CargosFacturaWithRelations = CargosFactura & CargosFacturaRelations;
