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
    type: 'number',
    precision: 10,
    scale: 0,
    mssql: {columnName: 'UsuarioId', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  usuarioId?: number;

  @property({
    type: 'boolean',
    mssql: {columnName: 'Tipo', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  tipo?: boolean;

  @property({
    type: 'string',
    length: 250,
    mssql: {columnName: 'Nombre', dataType: 'varchar', dataLength: 250, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  nombre?: string;

  @property({
    type: 'string',
    length: 200,
    mssql: {columnName: 'Correo', dataType: 'varchar', dataLength: 250, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  correo?: string;

  @property({
    type: 'string',
    length: 250,
    mssql: {columnName: 'Telefono', dataType: 'varchar', dataLength: 250, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  telefono?: string;

  @property({
    type: 'string',
    length: 250,
    mssql: {columnName: 'Direccion', dataType: 'varchar', dataLength: 250, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  direccion?: string;

  @property({
    type: 'string',
    length: 250,
    mssql: {columnName: 'Imagen', dataType: 'varchar', dataLength: 250, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  imagen?: string;

  @property({
    type: 'string',
    length: 250,
    mssql: {columnName: 'ImagenId', dataType: 'varchar', dataLength: 250, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  imagenId?: string;

  @property({
    type: 'string',
    length: -1,
    mssql: {columnName: 'Observacion', dataType: 'varchar', dataLength: -1, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  observacion?: string;

  @property({
    type: 'boolean',
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  estado?: boolean;

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
