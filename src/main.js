import server from "./controllers/ServerController.js";

server.start(8888, "localhost", () => console.log("> Server online at http://localhost:8888/"));