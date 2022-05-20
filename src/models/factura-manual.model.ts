import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'FacturaManual'}}})
export class FacturaManual extends Entity {
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
    required: true,
    precision: 10,
    scale: 0,
    mssql: {columnName: 'contratoId', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO'},
  })
  contratoId: number;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    mssql: {columnName: 'tipoFacturaId', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO'},
  })
  tipoFacturaId: number;

  @property({
    type: 'string',
    required: true,
    length: 100,
    mssql: {columnName: 'codigo', dataType: 'nvarchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  codigo: string;

  @property({
    type: 'date',
    required: true,
    mssql: {columnName: 'fechaInicial', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  fechaInicial: string;

  @property({
    type: 'date',
    required: true,
    mssql: {columnName: 'fechaFinal', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  fechaFinal: string;

  @property({
    type: 'date',
    required: true,
    mssql: {columnName: 'fechaEmision', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  fechaEmision: string;

  @property({
    type: 'date',
    required: true,
    mssql: {columnName: 'fechaVencimiento', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  fechaVencimiento: string;

  @property({
    type: 'number',
    required: false,
    precision: 53,
    mssql: {columnName: 'valor', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES'},
  })
  cargoReactivo?: number;


  @property({
    type: 'boolean',
    required: true,
    mssql: {columnName: 'estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  estado: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<FacturaManual>) {
    super(data);
  }
}

export interface FacturaManualRelations {
  // describe navigational properties here
}

export type FacturaManualWithRelations = FacturaManual & FacturaManualRelations;
