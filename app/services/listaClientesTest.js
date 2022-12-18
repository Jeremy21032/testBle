import { generateUIDD } from "../commons/utils";

const clientes = [
  {
    idCliente: 1,
    nombre: "Santiago Mosquera",
    identificacion: "1371231234",
    direccion: "Av. Amazonas y Naciones Unidad",
    telefono: "091234567",
    sincronizado: true,
  },
  {
    idCliente: 2,
    nombre: "Sacarías Flores del Campo",
    identificacion: "09393938",
    direccion: "Av. Amazonas y Naciones Unidad",
    telefono: "091234567",
    sincronizado: true,
  },
  {
    idCliente: 3,
    nombre: "Armando Casas",
    identificacion: "1331881234",
    direccion: "Av. Amazonas y Naciones Unidad",
    telefono: "091234567",
    sincronizado: false,
  },
  {
    idCliente: generateUIDD(),
    nombre: "Maria la del Barrio",
    identificacion: "1345651234",
    direccion: "Av. Amazonas y Naciones Unidad",
    telefono: "091234567",
    sincronizado: false,
  },
  {
    idCliente: generateUIDD(),
    nombre: "Cristhian Castro",
    identificacion: "1314719608",
    direccion: "Av. Amazonas y Naciones Unidad",
    telefono: "091234567",
    sincronizado: false,
  },
];
export default clientes;
