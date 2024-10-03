import express from "express";
import {
  authenticateJWT,
  authorizeRoles,
} from "../middlewares/auth-middleware";
import {
  deleteUser,
  getUsers,
  modifyUser,
} from "../controllers/admin-controller";

const router = express.Router();

// view all users (admin only)
router.get("/users", authenticateJWT, authorizeRoles("admin"), getUsers);

// modify user (block/unblock, promote/demote) (admin only)
router.patch(
  "/users/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  modifyUser
);

// delete a user (admin only)
router.delete(
  "/users/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  deleteUser
);

export default router;
