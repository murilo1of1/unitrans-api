import rotaController from "../controllers/rotaController.js";

export default (app) => {
  app.get("/rota", rotaController.get);
  app.get("/rota/:id", rotaController.get);
  app.post("/rota", rotaController.persist);
  app.patch("/rota/:id", rotaController.persist);
  app.delete("/rota/:id", rotaController.destroy);
  app.get("/empresa/:idEmpresa/rotas", rotaController.getByEmpresa);
  app.get("/veiculo/:idVeiculo/rotas", rotaController.getByVeiculo);
};
