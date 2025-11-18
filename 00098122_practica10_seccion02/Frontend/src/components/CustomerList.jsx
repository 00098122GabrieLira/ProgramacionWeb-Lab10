import React, { useState, useEffect } from "react";
import "../styles/CustomerList.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5000/api";

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      if (!response.ok) {
        throw new Error("Error al cargar clientes");
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="customer-list-container">
      <div className="customer-list-header">
        <h2>Lista de clientes</h2>
        <button
          className="btn-refresh"
          onClick={fetchCustomers}
          disabled={loading}
        >
          {loading ? " Cargando..." : " Actualizar"}
        </button>
      </div>

      {error && <div className="error-message"> {error}</div>}

      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Código</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="center">{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.address || "N/A"}</td>
                <td>{customer.phone || "N/A"}</td>
                <td className="code">{customer.code}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && !loading && (
          <div className="no-data"> No hay clientes registrados</div>
        )}
      </div>

      <div className="customer-stats">
        <span>Total de clientes: {customers.length}</span>
      </div>
    </div>
  );
};

export default CustomerList;
