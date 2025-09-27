import rotaController from "../controllers/rotaController.js";

export default (app) => {
  app.get("/rota", rotaController.get);
  app.get("/rota/:id", rotaController.get);
  app.post("/rota", rotaController.persist);
  app.patch("/rota/:id", rotaController.persist);
  app.delete("/rota/:id", rotaController.destroy);
  app.get("/empresa/:idEmpresa/rotas", rotaController.getByEmpresa);

  // Gestão de pontos da rota
  app.get("/rota/:idRota/pontos", rotaController.getPontosRota);
  app.post("/rota/:idRota/pontos", rotaController.addPontoToRota);
  app.delete(
    "/rota/:idRota/pontos/:idRotaPonto",
    rotaController.removePontoFromRota
  );
  app.patch(
    "/rota/:idRota/pontos/:idRotaPonto",
    rotaController.updatePontoRota
  );
};
