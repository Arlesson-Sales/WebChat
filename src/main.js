import server from "./controllers/ServerController.js";

server.start(process.env.PORT, () => console.log("> Server online!"));