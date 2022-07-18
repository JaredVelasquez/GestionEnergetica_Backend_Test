export interface InvoicesInterface {
  contratoId: number,
  codigo: string,
  fechaLectura: string,
  fechaVencimiento: string,
  fechaInicio: string,
  fechaFin: string,
  fechaEmision: string,
  energiaConsumida: number,
  consumoExterno: number,
  consumoSolar: number,
  total: number,
  estado: number
}
