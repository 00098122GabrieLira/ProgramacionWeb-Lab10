import { pool } from "../data/pool.js";

// Ejercicio 2: Obtener todos los clientes
export const getCustomers = (req, res) => {
  pool.query("SELECT * FROM Customers ORDER BY id ASC", (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(results.rows);
  });
};

// Ejercicio 3: Crear nueva venta
export const createSale = (req, res) => {
  const { amount, id_customer } = req.body;

  // Validar que el cliente exista
  pool.query(
    "SELECT id FROM Customers WHERE id = $1",
    [id_customer],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (results.rows.length === 0) {
        return res.status(404).json({ error: "Cliente no encontrado" });
      }

      // Insertar la venta
      pool.query(
        "INSERT INTO sales (amount, created_at, id_customer) VALUES ($1, NOW(), $2) RETURNING *",
        [amount, id_customer],
        (error, saleResults) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.status(201).json(saleResults.rows[0]);
        }
      );
    }
  );
};

// Ejercicio 4: Obtener todas las ventas con datos del cliente
export const getSalesWithCustomer = (req, res) => {
  pool.query(
    `SELECT s.id, s.amount, s.created_at, c.name as customer_name 
     FROM sales s 
     JOIN customers c ON s.id_customer = c.id 
     ORDER BY s.created_at DESC`,
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(results.rows);
    }
  );
};

// Ejercicio 5: Buscar cliente por código
export const searchCustomerByCode = (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Parámetro 'code' requerido" });
  }

  pool.query(
    "SELECT * FROM customers WHERE code = $1",
    [code],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(results.rows);
    }
  );
};

// Ejercicio 6: Reporte de ventas por cliente
export const getSalesReport = (req, res) => {
  pool.query(
    `SELECT c.name, SUM(s.amount) as total_sales 
     FROM sales s 
     JOIN customers c ON s.id_customer = c.id 
     GROUP BY c.name 
     ORDER BY total_sales DESC`,
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(results.rows);
    }
  );
};
