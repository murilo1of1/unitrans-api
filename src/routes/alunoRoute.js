import alunoController from "../controllers/alunoController.js";

export default (app) => {
  app.get("/aluno", alunoController.get);
  app.get("/aluno/:id", alunoController.get);
  app.post("/aluno", alunoController.persist);
  app.patch("/aluno/:id", alunoController.persist);
  app.delete("/aluno/:id", alunoController.destroy);
  app.post("/aluno/login", alunoController.login);
  app.post("/aluno/forgot-password", alunoController.forgotPassword);
  app.post("/aluno/reset-password", alunoController.resetPassword);
  app.post("/aluno/escolher-pontos", alunoController.salvarEscolhasPontos);
};
