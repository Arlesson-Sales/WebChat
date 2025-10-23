import server from "./controllers/ServerController.js";

server.start(process.env.PORT, "localhost", () => console.log("> Server online!"));