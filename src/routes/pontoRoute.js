import pontoController from "../controllers/pontoController.js";

export default (app) => {
  app.get("/ponto", pontoController.get);
  app.get("/ponto/:id", pontoController.get);
  app.post("/ponto", pontoController.persist);
  app.patch("/ponto/:id", pontoController.persist);
  app.delete("/ponto/:id", pontoController.destroy);
  app.get("/empresa/:idEmpresa/pontos", pontoController.getByEmpresa);
  app.post("/rota/ponto", pontoController.addToRota);
  app.delete("/rota/ponto/:id", pontoController.removeFromRota);
  app.patch("/rota/ponto/:id/toggle", pontoController.toggleAtivo);
};
