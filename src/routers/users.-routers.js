import usersController from "../controllers/UsersController.js";
import { Router } from "express";

const users_routers = Router();

users_routers.get("/users", usersController.getAll);
users_routers.post("/registration", usersController.registration.bind(usersController));
users_routers.post("/login", usersController.login.bind(usersController));

export { users_routers, usersController };

