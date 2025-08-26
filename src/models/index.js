import Empresa from "./EmpresaModel.js";
import Rota from "./RotaModel.js";
import Veiculo from "./VeiculoModel.js";
import Ponto from "./PontoModel.js";
import Plano from "./PlanoModel.js";
import Aluno from "./AlunoModel.js";
import Corrida from "./CorridaModel.js";
import PassageiroLog from "./PassageiroLogModel.js";
import Pagamento from "./PagamentoModel.js";
import EmpresaAluno from "./EmpresaAlunoModel.js";
import TokenAcesso from "./TokenAcessoModel.js";
import SolicitacaoVinculo from "./SolicitacaoVinculoModel.js";

(async () => {
  await Empresa.sync({ force: true });
  await Plano.sync({ force: true });
  await Rota.sync({ force: true });
  await Veiculo.sync({ force: true });
  await Ponto.sync({ force: true });
  await Aluno.sync({ force: true });
  await EmpresaAluno.sync({ force: true });
  await TokenAcesso.sync({ force: true });
  await SolicitacaoVinculo.sync({ force: true });
  await Corrida.sync({ force: true });
  await PassageiroLog.sync({ force: true });
  await Pagamento.sync({ force: true });
})();
