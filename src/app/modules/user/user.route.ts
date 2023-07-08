import express from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/:id", UserController.getSingleUser); // Get single user

router.patch(
  "/:id", // Update user
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser
);

router.delete("/:id", UserController.deleteUser); // Delete user

router.get("/", UserController.getAllUsers); // Get all users

export const UserRoutes = router;
