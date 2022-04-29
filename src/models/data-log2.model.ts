import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'DataLog2'}}})
export class DataLog2 extends Entity {
  @property({
    type: 'number',
    required: true,
    precision: 19,
    scale: 0,
    id: 1,
    mssql: {columnName: 'ID', dataType: 'bigint', dataLength: null, dataPrecision: 19, dataScale: 0, nullable: 'NO'},
  })
  id: number;

  @property({
    type: 'number',
    precision: 53,
    mssql: {columnName: 'Value', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES'},
  })
  value?: number;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    mssql: {columnName: 'SourceID', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO'},
  })
  sourceId: number;

  @property({
    type: 'number',
    required: true,
    precision: 5,
    scale: 0,
    mssql: {columnName: 'QuantityID', dataType: 'smallint', dataLength: null, dataPrecision: 5, dataScale: 0, nullable: 'NO'},
  })
  quantityId: number;

  @property({
    type: 'date',
    required: true,
    mssql: {columnName: 'TimestampUTC', dataType: 'datetime2', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  timestampUtc: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<DataLog2>) {
    super(data);
  }
}

export interface DataLog2Relations {
  // describe navigational properties here
}

export type DataLog2WithRelations = DataLog2 & DataLog2Relations;
