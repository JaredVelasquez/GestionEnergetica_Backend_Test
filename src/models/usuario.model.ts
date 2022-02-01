import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'usuario'}}})
export class Usuario extends Entity {
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
    mssql: {columnName: 'ActorId', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  actorId?: number;

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    mssql: {columnName: 'Rolid', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  rolid?: number;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'Nombre', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  nombre?: string;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'Apellido', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  apellido?: string;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'Telefono', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  telefono?: string;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'Observacion', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  observacion?: string;

  @property({
    type: 'boolean',
    mssql: {columnName: 'AD', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  ad?: boolean;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'Correo', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  correo?: string;

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    mssql: {columnName: 'TipoUsuario', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  tipoUsuario?: number;

  @property({
    type: 'boolean',
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  estado?: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
