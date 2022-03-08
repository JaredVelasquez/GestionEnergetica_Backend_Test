import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, mssql: {schema: 'dbo', table: 'ParametroTarifa'}}
})
export class ParametroTarifa extends Entity {
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
    mssql: {columnName: 'tipoCargoId', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO'},
  })
  tipoCargoId: number;

  @property({
    type: 'date',
    required: true,
    mssql: {columnName: 'fechaInicio', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  fechaInicio: string;

  @property({
    type: 'date',
    required: true,
    mssql: {columnName: 'fechaFinal', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  fechaFinal: string;

  @property({
    type: 'number',
    required: true,
    precision: 53,
    mssql: {columnName: 'valor', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'NO'},
  })
  valor: number;

  @property({
    type: 'string',
    length: -1,
    mssql: {columnName: 'observacion', dataType: 'varchar', dataLength: -1, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  observacion?: string;

  @property({
    type: 'boolean',
    required: true,
    mssql: {columnName: 'tipo', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  tipo: boolean;

  @property({
    type: 'boolean',
    mssql: {columnName: 'estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  estado?: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ParametroTarifa>) {
    super(data);
  }
}

export interface ParametroTarifaRelations {
  // describe navigational properties here
}

export type ParametroTarifaWithRelations = ParametroTarifa & ParametroTarifaRelations;
