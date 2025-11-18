import expres from "express";
import verifyToken from "../Middleware/token.js";
import {
  displayHome,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  signIn,
  Protected,
} from "../Controller/userController.js";

const router = expres.Router();

router.get("/", displayHome);
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.post("/users", createUser);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);
router.post("/signIn", signIn);
router.get("/protected", verifyToken, Protected);

export default router;
