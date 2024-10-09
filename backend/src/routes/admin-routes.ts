import express from "express";
import {
  authenticateJWT,
  authorizeRoles,
  checkIfNotBlocked,
} from "../middlewares/auth-middleware";
import {
  deleteUser,
  deleteUsersBatch,
  getUsers,
  modifyUser,
  modifyUsersBatch,
} from "../controllers/admin-controller";

const router = express.Router();

// view all users (admin only)
router.get("/users", authenticateJWT, authorizeRoles("admin"), getUsers);

// batch routes THESE ROUTES NEED TO GO FIRST
router.patch(
  "/users",
  authenticateJWT,
  checkIfNotBlocked,
  authorizeRoles("admin"),
  modifyUsersBatch
);

router.delete(
  "/users",
  authenticateJWT,
  checkIfNotBlocked,
  authorizeRoles("admin"),
  deleteUsersBatch
);

// modify user (block/unblock, promote/demote) (admin only)
router.patch(
  "/users/:id",
  authenticateJWT,
  checkIfNotBlocked,
  authorizeRoles("admin"),
  modifyUser
);

// delete a user (admin only)
router.delete(
  "/users/:id",
  authenticateJWT,
  checkIfNotBlocked,
  authorizeRoles("admin"),
  deleteUser
);

export default router;
