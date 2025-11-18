import React, { useState, useEffect } from "react";
import "../styles/SalesForm.css";

const SalesForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    id_customer: "",
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      showMessage("Error al cargar clientes", "error");
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.id_customer) {
      showMessage("Todos los campos son requeridos", "error");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      showMessage("El monto debe ser mayor a 0", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          id_customer: parseInt(formData.id_customer),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("Venta registrada exitosamente!", "success");
        setFormData({ amount: "", id_customer: "" });
      } else {
        showMessage(`Error: ${data.error}`, "error");
      }
    } catch (error) {
      showMessage(`Error de conexión: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="sales-form-container">
      <h2>Registrar nueva venta</h2>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <form onSubmit={handleSubmit} className="sales-form">
        <div className="form-group">
          <label htmlFor="id_customer">Cliente *</label>
          <select
            id="id_customer"
            name="id_customer"
            value={formData.id_customer}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Seleccionar cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.code}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Monto ($) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Registrando...
            </>
          ) : (
            "Registrar venta"
          )}
        </button>
      </form>

      <div className="form-info">
        <p>
          <strong>Información:</strong>
        </p>
        <ul>
          <li>Todos los campos marcados con * son obligatorios</li>
          <li>El monto debe ser mayor a $0.00</li>
          <li>La fecha se asignará automáticamente</li>
        </ul>
      </div>
    </div>
  );
};

export default SalesForm;
