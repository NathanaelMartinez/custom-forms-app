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
router.get("/admin/users", authenticateJWT, authorizeRoles("admin"), getUsers);

// modify user (block/unblock, promote/demote) (admin only)
router.patch(
  "/admin/users/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  modifyUser
);

// delete a user (admin only)
router.delete(
  "/admin/users/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  deleteUser
);

export default router;
