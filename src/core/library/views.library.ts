export namespace viewOf {
  export const GET_METERS = `SELECT * FROM dbo.GetMonitors`;
  export const GET_Virtual_METERS = `SELECT * FROM dbo.GetVMonitors`;
  export const GET_Clients = `SELECT * FROM dbo.GetCliente`;
  export const GET_Providers = `SELECT * FROM dbo.GetProveedor`;
  export const GET_Zones = `SELECT * FROM dbo.GetZonas`;
  export const GET_RATES = `SELECT * FROM dbo.GetTarifas`;
  export const GET_RATE_PARAMETERS = `SELECT * FROM dbo.GetParametros`;
  export const GET_ALL_PARAMETERS = `SELECT * FROM dbo.GetAllParametros`;
  export const GET_CONTRACTS = `SELECT * FROM dbo.GetContratos`;
  export const GET_INVOICES = `SELECT * FROM dbo.GetFacturas`;
  export const GET_ESPECIAL_CHARGES = `SELECT * FROM dbo.GetCEspeciales`;
  export const GET_PT_DETAIL = `SELECT * FROM dbo.GetTPdetalle`;
  export const GET_CMETERS = `SELECT * FROM dbo.GetCMedidores`;
}
