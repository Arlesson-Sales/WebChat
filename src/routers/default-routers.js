import { loginTokenAuth } from "../middlewares/authenticate.js";
import { Router } from "express";

const router = Router();

router.get("/", loginTokenAuth, (request, response) => {
    response.status(200).redirect("/home");
});

router.get("/forms", (request, response) => {
    const message = request.query.message;
    response.status(200).render("forms.ejs", { message, logged: false });
});

router.get("/home", loginTokenAuth, (request, response) => {
    const { name } = request.user;
    response.cookie("user_name", name, { path: "/home" });
    response.status(200).render("home.ejs", { name });
});

export default router;