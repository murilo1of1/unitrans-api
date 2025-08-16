import empresaController from "../controllers/empresaController.js";

export default (app) => {
  app.get("/empresa", empresaController.get);
  app.get("/empresa/:id", empresaController.get);
  app.post("/empresa", empresaController.persist);
  app.patch("/empresa/:id", empresaController.persist);
  app.delete("/empresa/:id", empresaController.destroy);
  app.post("/empresa/login", empresaController.login);
  app.post("/empresa/forgot-password", empresaController.forgotPassword);
  app.post("/empresa/reset-password", empresaController.resetPassword);
};
