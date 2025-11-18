import React, { useState } from "react";
import CustomerList from "./components/CustomerList";
import SalesForm from "./components/SalesForm";
import SalesList from "./components/SalesList";
import CustomerSearch from "./components/CustomerSearch";
import SalesReport from "./components/SalesReport";
import "./styles/App.css";

const App = () => {
  // Estados para navegación principal
  const [activeMainTab, setActiveMainTab] = useState("users");
  const [activeAuthTab, setActiveAuthTab] = useState("signup");
  const [activeSection, setActiveSection] = useState("customers");

  // Resto de estados...
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [response, setResponse] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  const API_BASE_URL = "http://localhost:5000/api";

  // Estados para formularios de autenticación
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signinData, setSigninData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [userData, setUserData] = useState({ id: "", name: "", email: "" });

  // Función para mostrar modal
  const showModalDialog = (title, message, onConfirm = null) => {
    setModalContent({ title, message, onConfirm });
    setShowModal(true);
  };

  // Función para cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setModalContent({ title: "", message: "", onConfirm: null });
  };

  const showResponse = (status, data, endpoint = "") => {
    setResponseStatus(status);

    const statusMessages = {
      200: "OK - Solicitud exitosa",
      201: "Created - Usuario creado exitosamente",
      400: "Bad Request - Datos inválidos en la solicitud",
      401: "Unauthorized - No autenticado o token inválido",
      403: "Forbidden - Token expirado o sin permisos",
      404: "Not Found - Recurso no encontrado",
      409: "Conflict - El usuario ya existe",
      500: "Internal Server Error - Error del servidor",
    };

    const statusMessage = statusMessages[status] || `Código: ${status}`;

    let formattedResponse = `Endpoint: ${endpoint}\n`;
    formattedResponse += `Status: ${statusMessage}\n\n`;

    if (typeof data === "string") {
      formattedResponse += `Respuesta:\n${data}`;
    } else if (data && typeof data === "object") {
      if (data.token) {
        formattedResponse += `Token: ${data.token}\n\n`;
      }
      if (data.user) {
        formattedResponse += `Información del Usuario:\n${JSON.stringify(
          data.user,
          null,
          2
        )}\n\n`;
      }
      if (Array.isArray(data)) {
        formattedResponse += `Lista de Usuarios (${
          data.length
        } encontrados):\n${JSON.stringify(data, null, 2)}`;
      } else {
        formattedResponse += `Datos Recibidos:\n${JSON.stringify(
          data,
          null,
          2
        )}`;
      }
    } else {
      formattedResponse += `Respuesta:\n${data}`;
    }

    setResponse(formattedResponse);
  };

  // Sign Up
  const handleSignUp = async () => {
    if (!signupData.name || !signupData.email || !signupData.password) {
      showResponse(400, "Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      showResponse(response.status, data, "POST /users");

      if (response.ok) {
        setSignupData({ name: "", email: "", password: "" });
        setActiveAuthTab("signin");
        setSigninData((prev) => ({ ...prev, email: signupData.email }));
      }
    } catch (error) {
      showResponse(500, `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Sign In
  const handleSignIn = async () => {
    if (!signinData.name || !signinData.email || !signinData.password) {
      showResponse(400, "Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signinData),
      });

      const data = await response.json();
      showResponse(response.status, data, "POST /signin");

      if (response.ok && data.token) {
        setToken(data.token);
        setSigninData({ name: "", email: "", password: "" });
      }
    } catch (error) {
      showResponse(500, `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Obtener todos los usuarios
  const handleGetAllUsers = async () => {
    if (!token) {
      showResponse(401, "Token requerido");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      showResponse(response.status, data, "GET /users");
    } catch (error) {
      showResponse(500, `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Obtener usuario por ID
  const handleGetUserById = async () => {
    if (!token) {
      showResponse(401, "Token requerido");
      return;
    }

    if (!userData.id) {
      showResponse(400, "ID de usuario requerido");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      showResponse(response.status, data, `GET /users/${userData.id}`);
    } catch (error) {
      showResponse(500, `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar usuario
  const handleUpdateUser = async () => {
    if (!token) {
      showResponse(401, "Token requerido");
      return;
    }

    if (!userData.id) {
      showResponse(400, "ID de usuario requerido");
      return;
    }

    if (!userData.name || !userData.email) {
      showResponse(400, "Nombre y email son requeridos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userData.name, email: userData.email }),
      });

      const data = await response.text();
      showResponse(response.status, data, `PUT /users/${userData.id}`);
    } catch (error) {
      showResponse(500, `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async () => {
    if (!token) {
      showResponse(401, "Token requerido");
      return;
    }

    if (!userData.id) {
      showResponse(400, "ID de usuario requerido");
      return;
    }

    showModalDialog(
      "Confirmar eliminación",
      `¿Estás seguro de que quieres eliminar al usuario con ID ${userData.id}?`,
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = await response.text();
          showResponse(response.status, data, `DELETE /users/${userData.id}`);
        } catch (error) {
          showResponse(500, `Error: ${error.message}`);
        } finally {
          setLoading(false);
          closeModal();
        }
      }
    );
  };

  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  // Renderizar el componente activo
  const renderGuideContent = () => {
    switch (activeSection) {
      case "customers":
        return <CustomerList />;
      case "sales":
        return <SalesForm />;
      case "salesList":
        return <SalesList />;
      case "search":
        return <CustomerSearch />;
      case "report":
        return <SalesReport />;
      default:
        return <CustomerList />;
    }
  };

  // Renderizar el formulario de autenticación activo
  const renderAuthForm = () => {
    if (activeAuthTab === "signup") {
      return (
        <div className="auth-content active">
          <div className="form-group">
            <label htmlFor="signupName">Nombre:</label>
            <input
              type="text"
              id="signupName"
              value={signupData.name}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
              placeholder="Ingresa tu nombre"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signupEmail">Email:</label>
            <input
              type="email"
              id="signupEmail"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              placeholder="Ingresa tu email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signupPassword">Contraseña:</label>
            <input
              type="password"
              id="signupPassword"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <button className="btn" onClick={handleSignUp} disabled={loading}>
            {loading ? "Procesando..." : "Registrarse"}
          </button>
        </div>
      );
    } else {
      return (
        <div className="auth-content active">
          <div className="form-group">
            <label htmlFor="signinName">Nombre:</label>
            <input
              type="text"
              id="signinName"
              value={signinData.name}
              onChange={(e) =>
                setSigninData({ ...signinData, name: e.target.value })
              }
              placeholder="Ingresa tu nombre"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signinEmail">Email:</label>
            <input
              type="email"
              id="signinEmail"
              value={signinData.email}
              onChange={(e) =>
                setSigninData({ ...signinData, email: e.target.value })
              }
              placeholder="Ingresa tu email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signinPassword">Contraseña:</label>
            <input
              type="password"
              id="signinPassword"
              value={signinData.password}
              onChange={(e) =>
                setSigninData({ ...signinData, password: e.target.value })
              }
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <button className="btn" onClick={handleSignIn} disabled={loading}>
            {loading ? "Procesando..." : "Iniciar sesión"}
          </button>
        </div>
      );
    }
  };

  return (
    <div className="container">
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modalContent.title}</h3>
            </div>
            <div className="modal-body">
              <p>{modalContent.message}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              {modalContent.onConfirm && (
                <button
                  className="btn btn-danger"
                  onClick={modalContent.onConfirm}
                >
                  Confirmar
                </button>
              )}
              {!modalContent.onConfirm && (
                <button className="btn" onClick={closeModal}>
                  Aceptar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="header">
        <h1>Sistema de gestión de usuarios y ventas</h1>
      </div>

      {/* Navegación principal */}
      <div className="dashboard">
        {/* Card de Navegación */}
        <div className="card">
          <div className="main-tabs">
            <button
              className={`main-tab ${
                activeMainTab === "users" ? "active" : ""
              }`}
              onClick={() => setActiveMainTab("users")}
            >
              Gestión de usuarios
            </button>
            <button
              className={`main-tab ${
                activeMainTab === "guide" ? "active" : ""
              }`}
              onClick={() => setActiveMainTab("guide")}
            >
              Clientes y ventas
            </button>
          </div>

          {activeMainTab === "users" && (
            <div className="tab-content active">
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${
                    activeAuthTab === "signup" ? "active" : ""
                  }`}
                  onClick={() => setActiveAuthTab("signup")}
                >
                  Registrarse
                </button>
                <button
                  className={`auth-tab ${
                    activeAuthTab === "signin" ? "active" : ""
                  }`}
                  onClick={() => setActiveAuthTab("signin")}
                >
                  Iniciar sesión
                </button>
              </div>

              {renderAuthForm()}
            </div>
          )}

          {activeMainTab === "guide" && (
            <div className="tab-content active">
              <div className="guide-navigation">
                <div className="guide-tabs">
                  <button
                    className={`guide-tab ${
                      activeSection === "customers" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("customers")}
                  >
                    Lista de clientes
                  </button>
                  <button
                    className={`guide-tab ${
                      activeSection === "sales" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("sales")}
                  >
                    Registrar nueva venta
                  </button>
                  <button
                    className={`guide-tab ${
                      activeSection === "salesList" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("salesList")}
                  >
                    Lista de ventas
                  </button>
                  <button
                    className={`guide-tab ${
                      activeSection === "search" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("search")}
                  >
                    Buscar cliente
                  </button>
                  <button
                    className={`guide-tab ${
                      activeSection === "report" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("report")}
                  >
                    Reporte de ventas
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card de gestión de usuarios - Solo visible en pestaña de usuarios */}
        {activeMainTab === "users" && (
          <div className="card">
            <h2>Gestión de usuarios</h2>

            <div className="form-group">
              <label htmlFor="authToken">Token:</label>
              <div className="token-input-container">
                <input
                  type={showToken ? "text" : "password"}
                  id="authToken"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Pega aquí tu token"
                  className="token-input"
                />
                <button
                  className="btn-token-toggle"
                  onClick={toggleTokenVisibility}
                  type="button"
                >
                  {showToken ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="button-grid">
              <button
                className="btn"
                onClick={handleGetAllUsers}
                disabled={loading}
              >
                Mostrar usuarios
              </button>
              <button
                className="btn"
                onClick={handleGetUserById}
                disabled={loading}
              >
                Mostrar por ID
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="userId">ID de usuario:</label>
              <input
                type="number"
                id="userId"
                value={userData.id}
                onChange={(e) =>
                  setUserData({ ...userData, id: e.target.value })
                }
                placeholder="ID para buscar, actualizar o eliminar"
              />
            </div>

            <div className="form-group">
              <label htmlFor="userName">Nombre:</label>
              <input
                type="text"
                id="userName"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                placeholder="Nombre para actualizar"
              />
            </div>

            <div className="form-group">
              <label htmlFor="userEmail">Email:</label>
              <input
                type="email"
                id="userEmail"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                placeholder="Email para actualizar"
              />
            </div>

            <div className="button-grid">
              <button
                className="btn"
                onClick={handleUpdateUser}
                disabled={loading}
              >
                Actualizar usuario
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteUser}
                disabled={loading}
              >
                Eliminar usuario
              </button>
            </div>
          </div>
        )}

        {/* Card del ejercicio activo */}
        {activeMainTab === "guide" && (
          <div className="card guide-exercise">{renderGuideContent()}</div>
        )}
      </div>

      {/* Sección de resultados - Solo visible en Gestión de usuarios */}
      {activeMainTab === "users" && (
        <div className="results">
          <h2>Respuestas del Servidor</h2>
          <div
            className={`status ${
              responseStatus >= 200 && responseStatus < 300
                ? "success"
                : "error"
            }`}
          >
            Status: {responseStatus}
          </div>
          <div className="response">
            {response || "Las respuestas de la API aparecerán aquí..."}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
