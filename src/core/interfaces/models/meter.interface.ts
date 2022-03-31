export interface meterSchema {
  id?: number;
  codigo: string;
  sourceId: string;
  descripcion: string;
  modelo: string;
  serie: string;
  lecturaMax: number;
  puntoMedicionId: number;
  observacion: string;
  puntoConexion: number;
  tipo: number;
  registroDatos: boolean,
  almacenamientoLocal: boolean,
  funcionalidad: boolean,
  estado: boolean;
}

export interface meterRelationSchema {
  id?: number;
  medidorId: number;
  porcentaje: number;
  operacion: boolean;
  observacion: string;
  estado: boolean;
}
