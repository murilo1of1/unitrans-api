import Empresa from "./EmpresaModel.js";
import Rota from "./RotaModel.js";
import Ponto from "./PontoModel.js";
import RotaPonto from "./RotaPontoModel.js";
import Plano from "./PlanoModel.js";
import Aluno from "./AlunoModel.js";
import Corrida from "./CorridaModel.js";
import PassageiroLog from "./PassageiroLogModel.js";
import Pagamento from "./PagamentoModel.js";
import EmpresaAluno from "./EmpresaAlunoModel.js";
import TokenAcesso from "./TokenAcessoModel.js";
import SolicitacaoVinculo from "./SolicitacaoVinculoModel.js";

Rota.hasMany(RotaPonto, {
  as: "pontos",
  foreignKey: "idRota",
});

RotaPonto.belongsTo(Rota, {
  as: "rota",
  foreignKey: "idRota",
});

RotaPonto.belongsTo(Ponto, {
  as: "ponto",
  foreignKey: "idPonto",
});

Ponto.hasMany(RotaPonto, {
  as: "rotaPontos",
  foreignKey: "idPonto",
});

(async () => {
  await Empresa.sync({ force: true });
  await Plano.sync({ force: true });
  await Rota.sync({ force: true });
  await Ponto.sync({ force: true });
  await RotaPonto.sync({ force: true });
  await Aluno.sync({ force: true });
  await EmpresaAluno.sync({ force: true });
  await TokenAcesso.sync({ force: true });
  await SolicitacaoVinculo.sync({ force: true });
  await Corrida.sync({ force: true });
  await PassageiroLog.sync({ force: true });
  await Pagamento.sync({ force: true });
})();
