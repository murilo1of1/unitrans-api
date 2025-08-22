import veiculoController from "../controllers/veiculoController.js";

export default (app) => {
  app.get("/veiculo", veiculoController.get);
  app.get("/veiculo/:id", veiculoController.get);
  app.post("/veiculo", veiculoController.persist);
  app.patch("/veiculo/:id", veiculoController.persist);
  app.delete("/veiculo/:id", veiculoController.destroy);
  app.get("/empresa/:idEmpresa/veiculos", veiculoController.getByEmpresa);
};
