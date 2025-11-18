import React, { useState, useEffect } from "react";
import "../styles/SalesReport.css";

const SalesReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5000/api";

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/sales/report`);
      if (!response.ok) {
        throw new Error("Error al cargar el reporte");
      }
      const data = await response.json();
      setReport(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const totalSales = report.reduce(
    (sum, item) => sum + parseFloat(item.total_sales || 0),
    0
  );
  const averageSale = report.length > 0 ? totalSales / report.length : 0;

  return (
    <div className="sales-report-container">
      <div className="report-header">
        <h2>Reporte de ventas por cliente</h2>
        <button
          className="btn-refresh"
          onClick={fetchReport}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {error && <div className="error-message"> {error}</div>}

      <div className="report-summary">
        <div className="summary-card total">
          <div className="summary-icon"></div>
          <div className="summary-content">
            <div className="summary-label">Ventas totales</div>
            <div className="summary-value">{formatCurrency(totalSales)}</div>
          </div>
        </div>

        <div className="summary-card clients">
          <div className="summary-icon"></div>
          <div className="summary-content">
            <div className="summary-label">Clientes activos</div>
            <div className="summary-value">{report.length}</div>
          </div>
        </div>

        <div className="summary-card average">
          <div className="summary-icon"></div>
          <div className="summary-content">
            <div className="summary-label">Promedio por cliente</div>
            <div className="summary-value">{formatCurrency(averageSale)}</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Total de ventas</th>
              <th>Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {report.map((item, index) => {
              const percentage =
                totalSales > 0 ? (item.total_sales / totalSales) * 100 : 0;
              return (
                <tr key={index}>
                  <td className="client-name">
                    <span className="client-rank">#{index + 1}</span>
                    {item.name}
                  </td>
                  <td className="sales-amount">
                    {formatCurrency(item.total_sales)}
                  </td>
                  <td className="percentage">
                    <div className="percentage-bar-container">
                      <div
                        className="percentage-bar"
                        style={{ width: `${percentage}%` }}
                      ></div>
                      <span className="percentage-text">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className="total-label">
                <strong>TOTAL GENERAL</strong>
              </td>
              <td className="total-amount">
                <strong>{formatCurrency(totalSales)}</strong>
              </td>
              <td className="total-percentage">
                <strong>100%</strong>
              </td>
            </tr>
          </tfoot>
        </table>

        {report.length === 0 && !loading && (
          <div className="no-data">No hay datos de ventas para mostrar</div>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
