import { loginTokenAuth } from "../middlewares/authenticate.js";
import usersController from "../controllers/UsersController.js";
import { Router } from "express";

const users_routers = Router();

users_routers.get("/api/users", usersController.getAll);
users_routers.get("/api/online", usersController.getOnline.bind(usersController));
users_routers.post("/registration", usersController.registration.bind(usersController));
users_routers.post("/login", usersController.login.bind(usersController));
users_routers.get("/logout", loginTokenAuth, usersController.logout.bind(usersController));

export { users_routers, usersController };

