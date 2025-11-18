import expres from "express";
import verifyToken from "../Middleware/token.js";
import {
  getCustomers,
  createSale,
  getSalesWithCustomer,
  searchCustomerByCode,
  getSalesReport,
} from "../Controller/customerController.js";

const router = expres.Router();

router.get("/customers", getCustomers); //Obtener todos los clientes
router.post("/sales", createSale); //Crear nueva venta
router.get("/sales", getSalesWithCustomer); //Obtener todas las ventas con datos del cliente
router.get("/customers/search", searchCustomerByCode); //Buscar cliente por código
router.get("/sales/report", getSalesReport); //Reporte de ventas por cliente

export default router;