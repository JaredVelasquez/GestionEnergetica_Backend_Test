export namespace viewOf {
  export const GET_METERS = `SELECT * FROM dbo.GetMonitors`;
  export const GET_Virtual_METERS = `SELECT * FROM dbo.GetVMonitors`;
  export const GET_Virtual_METERS_DETAIL = `SELECT * FROM dbo.GetVMonitorsDetalle`;
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
  export const GET_MANUAL_REGISTERS = `SELECT * FROM dbo.GetRegistrosManuales`;
  export const GET_MANUAL_INVOICE_DETAIL = `SELECT * FROM dbo.GetFacturasManuales`;
  export const GET_IONDATA = `SELECT *, dateadd(hour,-6,TimestampUTC) Fecha FROM  dbo.GetIONDATA `;
  export const GET_SOURCE = `SELECT * FROM ION_Data.dbo.Source where ID != 5 and  ID != 4 and  ID != 3 and  ID != 1  and  ID != 2 ORDER BY Name ASC`;
  export const GET_EHH_INVOICE = `SELECT * FROM dbo.GetFacturaEEH`;
  export const GET_METERS_ON_CONTRACT = `SELECT *FROM dbo.GetMedidoresActivos src where ID != 5 and  ID != 4 and  ID != 3 and  ID != 1  and  ID != 2  ORDER BY Name ASC`;
  export const GET_ALL_IONDATA = `SELECT *, dateadd(hour,-6,TimestampUTC) Fecha FROM dbo.GetAllIONDATA`;
  export const GET_MANUAL_REGISTERS_FOR_DATE = `SELECT * FROM dbo.GetRegistrosManualesPorMedidor`;
  export const GET_EEHINVOICE_CHARGUES = ` SELECT * FROM dbo.GetCargosXFactura `;
  export const GET_ACTIVE_SOURCE = ` SELECT * FROM dbo.GetSource `;
  export const GET_CREDENTIAL = ` SELECT * FROM dbo.GetCrendential `;


}
