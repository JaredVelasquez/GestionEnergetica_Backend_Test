import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Factura'}}})
export class Factura extends Entity {
  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    id: 1,
    mssql: {columnName: 'Id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO'},
  })
  id: number;

  @property({
    type: 'string',
    length: 50,
    mssql: {columnName: 'codigo', dataType: 'varchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  codigo?: string;

  @property({
    type: 'date',
    mssql: {columnName: 'fechaLectura', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  fechaLectura?: string;

  @property({
    type: 'date',
    mssql: {columnName: 'fechaEmision', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  fechaEmision?: string;

  @property({
    type: 'date',
    mssql: {columnName: 'fechaVencimiento', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  fechaVencimiento?: string;

  @property({
    type: 'date',
    mssql: {columnName: 'fechaInicio', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  fechaInicio?: string;

  @property({
    type: 'date',
    mssql: {columnName: 'fechaFin', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  fechaFin?: string;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'titular', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  titular?: string;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'direccion', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  direccion?: string;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'codigoCliente', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  codigoCliente?: string;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'medidor', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  medidor?: string;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    mssql: {columnName: 'medidorId', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO'},
  })
  medidorId: number;

  @property({
    type: 'number',
    precision: 53,
    mssql: {columnName: 'energiaConsumida', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES'},
  })
  energiaConsumida?: number;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'tipoConsumo', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  tipoConsumo?: string;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'tarifa', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  tarifa?: string;

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    mssql: {columnName: 'tarifaId', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  tarifaId?: number;

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    mssql: {columnName: 'contratoId', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  contratoId?: number;

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

  constructor(data?: Partial<Factura>) {
    super(data);
  }
}

export interface FacturaRelations {
  // describe navigational properties here
}

export type FacturaWithRelations = Factura & FacturaRelations;
