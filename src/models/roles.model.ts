import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Roles'}}})
export class Roles extends Entity {
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
    length: 50,
    mssql: {columnName: 'Nombre', dataType: 'nvarchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  nombre?: string;

  @property({
    type: 'string',
    length: 50,
    mssql: {columnName: 'Descripcion', dataType: 'nvarchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  descripcion?: string;

  @property({
    type: 'string',
    length: 50,
    mssql: {columnName: 'Estado', dataType: 'nvarchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  estado?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Roles>) {
    super(data);
  }
}

export interface RolesRelations {
  // describe navigational properties here
}

export type RolesWithRelations = Roles & RolesRelations;
