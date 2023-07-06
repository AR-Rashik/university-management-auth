import express from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/create-student", // create student as user
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createStudent
);

router.get("/", UserController.getAllUsers); // Get all faculties

export const UserRoutes = router;
