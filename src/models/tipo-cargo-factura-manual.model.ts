import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, mssql: {schema: 'dbo', table: 'tipoCargoFacturaManual'}}
})
export class TipoCargoFacturaManual extends Entity {
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
    mssql: {columnName: 'nombre', dataType: 'nvarchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
    precision: 53,
    mssql: {columnName: 'valor', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'NO'},
  })
  valor: string;

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

  constructor(data?: Partial<TipoCargoFacturaManual>) {
    super(data);
  }
}

export interface TipoCargoFacturaManualRelations {
  // describe navigational properties here
}

export type TipoCargoFacturaManualWithRelations = TipoCargoFacturaManual & TipoCargoFacturaManualRelations;
