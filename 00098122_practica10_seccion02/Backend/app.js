import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./Router/userRoutes.js";
import customerRoutes from "./Router/customerRoutes.js";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", customerRoutes);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
