export const PEDIDO_DETALLE_TABLE = {
  KEY_1: "idPedidoDetalle",
  ID_PEDIDO_2: "idPedido",
  ID_PRODUCTO_3: "idProducto",
  CANTIDAD_4: "cantidad",
  PRECIO_UNITARIO_5: "precioUnitario",
  SUBTOTAL_6: "subtotal",
};
export const PEDIDO_TABLE = {
  KEY_1: "idPedido",
  ID_VENDEDOR_2: "idVendedor",
  ID_CLIENTE_3: "idCliente",
  FECHA_4: "fecha",
  SUBTOTAL_5: "subtotal",
  IVA_6: "iva",
  TOTAL_7: "total",
  TEXTO_FACTURA_8: "textoFactura",
};
export const CLIENTE_TABLE = {
  KEY_1: "idCliente",
  NOMBRE_2: "nombre",
  IDENTIFICACION_3: "identificacion",
  DIRECCION_4: "direccion",
  TELEFONO_5: "telefono",
};
export const PRODUCTO_TABLE = {
  KEY_1: "idSap",
  DESCRIPCION_2: "descripcion",
  PRECIO_VENTA_3: "precioVenta",
  IVA_4: "iva",
  IMAGEN_5: "imagen",
  ID_CATEGORIA_6: "idCategoria",
};
export const STOCK_TABLE = {
  KEY_1: "id_stock",
  ID_VENDEDOR_2: "id_vendedor",
  ID_PRODUCTO_3: "id_producto_sap",
  STOCK_INICIAL_4: "stock_inicial",
  STOCK_ACTUAL_5: "stock_actual",
  FECHA_6: "fecha",
};
export const VENDEDOR_TABLE = {
  KEY_1: "id_vendedor",
  CORREO_2: "nombre",
  CENTRO_3: "correo",
  ALMACEN_4: "centro",
  NOMBRE_5: "almacen",
  NOMBRE_6: "codigo_prodiverso",
  AZUREUSER: "azure_user",
};

export const START_DAY_TABLE = {
  TABLE_NAME:"start_day",
  KEY_1: "id_day",
  ITEM_2: "is_init",
};
