import { to2Decimals } from "../commons/utils";

const VALOR_IVA = 12;

const carrito = [];

const detalleCarrito = {
  producto: "",
  cantidad: "",
  precioUnitario: "",
  subtotal: "",
};

export const getPedidoActual = () => {
  return carrito;
};

export const calcularFacturaPedido = (pedido) => {
  console.log('pedido2: ',pedido)
  let iva = 0;
  let subtotal = 0;
  pedido?.forEach((detallePedido) => {
    if (detallePedido?.producto.iva) {
      iva +=
        ((detallePedido?.producto.precio_venta * VALOR_IVA) / 100) *
        detallePedido?.cantidad;
    }
    subtotal += detallePedido?.producto.precio_venta * detallePedido?.cantidad;
  });
  return { iva:to2Decimals(iva), subtotal:to2Decimals(subtotal) };
};
