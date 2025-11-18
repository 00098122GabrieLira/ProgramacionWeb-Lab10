import React, { useState, useEffect } from "react";
import "../styles/SalesList.css";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5000/api";

  const fetchSales = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/sales`);
      if (!response.ok) {
        throw new Error("Error al cargar ventas");
      }
      const data = await response.json();
      setSales(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const totalAmount = sales.reduce(
    (sum, sale) => sum + parseFloat(sale.amount || 0),
    0
  );

  return (
    <div className="sales-list-container">
      <div className="sales-list-header">
        <h2>Lista de Ventas</h2>
        <button className="btn-refresh" onClick={fetchSales} disabled={loading}>
          {loading ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {error && <div className="error-message"> {error}</div>}

      <div className="sales-stats">
        <div className="stat-card">
          <span className="stat-label">Total Ventas</span>
          <span className="stat-value">{sales.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Monto Total</span>
          <span className="stat-value amount">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td className="center">#{sale.id}</td>
                <td className="customer-name">{sale.customer_name}</td>
                <td className="amount">{formatCurrency(sale.amount)}</td>
                <td className="date">{formatDate(sale.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {sales.length === 0 && !loading && (
          <div className="no-data">No hay ventas registradas</div>
        )}
      </div>
    </div>
  );
};

export default SalesList;
