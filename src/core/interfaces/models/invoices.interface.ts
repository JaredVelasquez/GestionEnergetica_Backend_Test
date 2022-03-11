export interface InvoicesInterface {
  contratoMedidorId: number,
  codigo: string,
  fechaLectura: string,
  fechaVencimiento: string,
  fechaInicio: string,
  fechaFin: string,
  tipoConsumo: number,
  energiaConsumida: number,
  observacion: string,
  estado: number,
  cargoId: number,
  parametroTarifaId: number,
}
