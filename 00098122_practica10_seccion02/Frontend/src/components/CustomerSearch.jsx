import React, { useState } from "react";
import "../styles/CustomerSearch.css";

const CustomerSearch = () => {
  const [searchCode, setSearchCode] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const API_BASE_URL = "http://localhost:5000/api";

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      showMessage("Ingrese un código para buscar", "error");
      return;
    }

    setLoading(true);
    setMessage("");
    setCustomer(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/customers/search?code=${encodeURIComponent(
          searchCode
        )}`
      );

      if (!response.ok) {
        throw new Error("Error en la búsqueda");
      }

      const data = await response.json();

      if (data.length > 0) {
        setCustomer(data[0]);
        showMessage("Cliente encontrado", "success");
      } else {
        showMessage("No se encontró ningún cliente con ese código", "error");
      }
    } catch (error) {
      showMessage(`Error: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchCode("");
    setCustomer(null);
    setMessage("");
  };

  return (
    <div className="customer-search-container">
      <h2>Buscar cliente por código</h2>

      <div className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Ingrese el código del cliente (ej: CLI001)"
            disabled={loading}
            className="search-input"
          />
          <button
            onClick={clearSearch}
            className="btn-clear"
            disabled={loading}
          >
            Eliminar
          </button>
        </div>

        <button
          className="btn-search"
          onClick={handleSearch}
          disabled={loading || !searchCode.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Buscando...
            </>
          ) : (
            "Buscar Cliente"
          )}
        </button>
      </div>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      {customer && (
        <div className="customer-details">
          <h3>Información del Cliente</h3>
          <div className="customer-info-grid">
            <div className="info-item">
              <label>ID:</label>
              <span className="value">#{customer.id}</span>
            </div>
            <div className="info-item">
              <label>Nombre:</label>
              <span className="value name">{customer.name}</span>
            </div>
            <div className="info-item">
              <label>Código:</label>
              <span className="value code">{customer.code}</span>
            </div>
            <div className="info-item">
              <label>Teléfono:</label>
              <span className="value">{customer.phone || "N/A"}</span>
            </div>
            <div className="info-item full-width">
              <label>Dirección:</label>
              <span className="value">{customer.address || "N/A"}</span>
            </div>
          </div>
        </div>
      )}

      <div className="search-tips">
        <h4>Tips de búsqueda:</h4>
        <ul>
          <li>Ingresa el código exacto del cliente</li>
          <li>Los códigos son sensibles a mayúsculas</li>
          <li>Presiona Enter para buscar rápidamente</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerSearch;
