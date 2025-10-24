import socketEvents from "../sockets-events.js";
import cookie_parser from "cookie-parser";
import { Server } from "socket.io";
import mongoose from "mongoose";
import express from "express";
import http from "http";
import ejs from "ejs";

import { users_routers } from "../routers/users.-routers.js";
import default_routers from "../routers/default-routers.js";


class ServerController
{
    app = express();
    server = http.createServer(this.app);
    io = new Server(this.server);

    socketsEventsSetup() { this.io.on("connection", socketEvents); }

    /** Quando chamado esse método faz com que seja estabelecida uma conexão com o banco de dados. */
    async connectToDatabase()
    {
        try {
            await mongoose.connect(process.env.DATABASE_KEY);
            console.log("> Conectado ao banco de dados!");
        } catch (erro) {
            console.log(`> Erro ao conectar ao banco de dados: ${erro.message}`);
        }
    }

    /**
     * Esse método faz todas as operações importantes para a inicialização do servidor.
     * @param {number} port Número da porta.
     * @param {Function} backlog Callback que será quando servidor estiver de pé.
     */
    async start(port, backlog)
    {
        await this.connectToDatabase();
        socketEvents(this.io);

        //Definindo middlewares
        this.app.use("/public", express.static("./src/public"));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        //Definindo mecanismo de modelos
        this.app.engine("ejs", ejs.renderFile);
        this.app.set("views", "./src/pages");
        this.app.set("view engine", "ejs");
        //Definindo as rotas
        this.app.use(cookie_parser());
        this.app.use(default_routers);
        this.app.use(users_routers);
        //Colocando servidor de pé
        this.server.listen(port, backlog);
    }
}

export default new ServerController();