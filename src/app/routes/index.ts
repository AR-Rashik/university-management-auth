import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { UserAuthRoutes } from "../modules/user/user.auth.route";

const router = express.Router();

// Individual Application routes
const moduleRoutes = [
  {
    path: "/auth/",
    route: UserAuthRoutes,
  },
  {
    path: "/users/",
    route: UserRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route)); // optimize router.use with forEach method

// router.use("/users/", UserRoutes);
// router.use("/academic-semesters/", AcademicSemesterRoutes);

export default router;
