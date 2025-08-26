import vinculoController from "../controllers/vinculoController.js";

export default (app) => {
  app.post("/vinculo", vinculoController.criarVinculo);
  app.get("/vinculo/aluno/:idAluno", vinculoController.listarVinculosAluno);
  app.get("/vinculo/empresa/:idEmpresa", vinculoController.listarVinculosEmpresa);
  app.patch("/vinculo/:id/desativar", vinculoController.desativarVinculo);
  app.patch("/vinculo/:id/reativar", vinculoController.reativarVinculo);

  app.post("/vinculo/token", vinculoController.gerarToken);
  app.get("/vinculo/token/empresa/:idEmpresa", vinculoController.listarTokensEmpresa);
  app.patch("/vinculo/token/:id/revogar", vinculoController.revogarToken);
  app.post("/vinculo/usar-token", vinculoController.vincularPorToken);

  app.post("/vinculo/solicitacao", vinculoController.solicitarVinculo);
  app.get("/vinculo/solicitacao/empresa/:idEmpresa", vinculoController.listarSolicitacoesEmpresa);
  app.get("/vinculo/solicitacao/aluno/:idAluno", vinculoController.listarSolicitacoesAluno);
  app.patch("/vinculo/solicitacao/:id/aprovar", vinculoController.aprovarSolicitacao);
  app.patch("/vinculo/solicitacao/:id/rejeitar", vinculoController.rejeitarSolicitacao);
};
