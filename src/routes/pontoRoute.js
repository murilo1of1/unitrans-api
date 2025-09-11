import pontoController from "../controllers/pontoController.js";

export default (app) => {
  app.post("/ponto", pontoController.persist);
  app.patch("/ponto/:id", pontoController.persist);
  app.delete("/ponto/:id", pontoController.destroy);
  app.get("/empresa/:idEmpresa/pontos", pontoController.getByEmpresa);
  app.post("/rota/ponto", pontoController.addToRota);
};
