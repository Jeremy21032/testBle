import React, { createContext, useRef, useState } from "react";
import { VALOR_IVA } from "../commons/const_values";
import { getStockById } from "../services/StockService";

const PedidoContext = createContext("session");

function PedidoProvider({ children }) {
  const [cliente, setCliente] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [pedido, setPedido] = useState({});
  const [carritoWithNoStock, setCarritoWithNoStock] = useState([]);

  const agregarProductoAlCarritoSinStock = (producto, cantidad) => {
    let exist = false;
    carritoWithNoStock?.forEach((item) => {
      if (item.producto.id_producto_sap === producto.id_producto_sap) {
        item.cantidad = parseInt(item.cantidad) + parseInt(cantidad);
        item.subtotal = item.cantidad * producto.precio_venta;
        exist = true;
      }
    });
    if (exist) {
      return;
    }
    carritoWithNoStock.push({
      producto,
      cantidad,
      precioUnitario: producto.precio_venta,
      subtotal: producto.precio_venta * cantidad,
    });
    const newc = [...carritoWithNoStock];
    setCarritoWithNoStock(newc);
    console.log("no stock: ", carritoWithNoStock);
  };

  const agregarProductoAlCarrito = (producto, cantidad, stock) => {
    console.log("stock:", stock?.stock_actual);
    console.log("cantidad: ", cantidad);
    if (!stock || stock?.stock_actual <= 0) {
      agregarProductoAlCarritoSinStock(producto, cantidad);
      return;
    }
    let exist = false;
    carrito?.forEach((item) => {
      if (item.producto.id_producto_sap === producto.id_producto_sap) {
        if (
          parseInt(stock.stock_actual) >=
          parseInt(cantidad) + parseInt(item.cantidad)
        ) {
          item.cantidad = parseInt(item.cantidad) + parseInt(cantidad);
          item.subtotal = item.cantidad * producto.precio_venta;
        } else {
          item.cantidad = stock.stock_actual;
          console.log("estamos aqio");
          item.subtotal = stock.stock_actual * producto.precio_venta;
          agregarProductoAlCarritoSinStock(
            producto,
            parseInt(cantidad) - parseInt(stock.stock_actual)
          );
        }
        exist = true;
        return;
      }
    });
    if (exist) {
      return;
    }

    if (parseInt(stock.stock_actual) >= parseInt(cantidad)) {
      console.log("cantidad 2: ", cantidad);
      carrito.push({
        producto,
        cantidad,
        precioUnitario: producto.precio_venta,
        subtotal: producto.precio_venta * cantidad,
      });
    } else {
      console.log("stocj menor a cantidad");
      carrito.push({
        producto,
        cantidad: stock.stock_actual,
        precioUnitario: producto.precio_venta,
        subtotal: producto.precio_venta * stock.stock_actual,
      });
      agregarProductoAlCarritoSinStock(producto, cantidad - stock.stock_actual);
    }
  };

  const removerProductoDelCarrito = (id) => {
    const id_producto_sap = carrito[id].producto.id_producto_sap;
    const newc = [...carrito];
    newc.splice(id, 1);
    setCarrito(newc);
    carritoWithNoStock?.forEach((element, index) => {
      if (element.producto.id_producto_sap === id_producto_sap) {
        removerProductoDelCarritoSinStock(index);
        return;
      }
    });
  };
  const removerProductoDelCarritoSinStock = (id) => {
    const newc = [...carritoWithNoStock];
    newc.splice(id, 1);
    setCarritoWithNoStock(newc);
  };

  const toExport = {
    pedido,
    setPedido,
    cliente,
    setCliente,
    carrito,
    setCarrito,
    carritoWithNoStock,
    agregarProductoAlCarrito,
    removerProductoDelCarrito,
    removerProductoDelCarritoSinStock,
    limpiarCarritos: () => {
      setCarrito([]), setCarritoWithNoStock([]);
    },
  };

  return (
    <PedidoContext.Provider value={toExport}>{children}</PedidoContext.Provider>
  );
}
export { PedidoContext, PedidoProvider };
