import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { pool } from "../data/pool.js";

const users = []; // Base de datos temporal (solo para pruebas)
const JWT_SECRET = "your_jwt_secret";

export const displayHome = (req, res) => {
  res.json({ message: "Node.js, Express, and Postgres API" });
};

//get all users
export const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// get users by ID
export const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//Post a new user
export const createUser = async (request, response) => {
  const { name, email, password } = request.body;

  const hashedPassword = await hash(password, 10);

  pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};

//Update user
export const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

//Delete user
export const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

// Sign In
export const signIn = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Buscar usuario en la base de datos
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Generar token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // Enviar respuesta con token e información del usuario
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error en signIn:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

//Protected
export const Protected = (req, res) => {
  res.status(200).json({ message: "Protected data accessed", user: req.user });
};
