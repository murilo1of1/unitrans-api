import Rota from "../models/RotaModel.js";
import Empresa from "../models/EmpresaModel.js";
import RotaPonto from "../models/RotaPontoModel.js";
import Ponto from "../models/PontoModel.js";
import RotaPassageiro from "../models/RotaPassageiroModel.js";
import EmpresaAluno from "../models/EmpresaAlunoModel.js";
import Aluno from "../models/AlunoModel.js";
import { Op } from "sequelize";

const get = async (req, res) => {
  try {
    const id = req.params.id
      ? req.params.id.toString().replace(/\D/g, "")
      : null;

    if (!id) {
      const response = await Rota.findAll({
        order: [["id", "desc"]],
        include: [
          {
            association: "empresa",
            attributes: ["id", "nome", "cnpj"],
          },
        ],
      });

      return res.status(200).send({
        message: "Dados encontrados",
        data: response,
      });
    }

    const response = await Rota.findOne({
      where: { id },
      include: [
        {
          association: "empresa",
          attributes: ["id", "nome", "cnpj"],
        },
      ],
    });

    if (!response) {
      return res.status(404).send("Rota não encontrada");
    }

    return res.status(200).send({
      message: "Dados encontrados",
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const getByEmpresa = async (req, res) => {
  try {
    const idEmpresa = req.params.idEmpresa
      ? req.params.idEmpresa.toString().replace(/\D/g, "")
      : null;

    if (!idEmpresa) {
      return res.status(400).send("ID da empresa é obrigatório");
    }

    const response = await Rota.findAll({
      where: { idEmpresa },
      order: [["id", "desc"]],
      include: [
        {
          model: RotaPonto,
          as: "pontos",
          include: [
            {
              model: Ponto,
              as: "ponto",
              attributes: ["id", "nome", "endereco", "latitude", "longitude"],
            },
          ],
          order: [["ordem", "asc"]],
        },
      ],
    });

    return res.status(200).send({
      message: "Rotas da empresa encontradas",
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const persist = async (req, res) => {
  try {
    const id = req.params.id
      ? req.params.id.toString().replace(/\D/g, "")
      : null;

    const { nome, origem, destino, tipo, idEmpresa } = req.body;

    if (!nome || !origem || !destino || !idEmpresa) {
      return res.status(400).send("Dados obrigatórios não informados");
    }

    const empresa = await Empresa.findByPk(idEmpresa);
    if (!empresa) {
      return res.status(404).send("Empresa não encontrada");
    }

    const data = { nome, origem, destino, idEmpresa };

    if (id) {
      await Rota.update(data, { where: { id } });
      const response = await Rota.findByPk(id);

      return res.status(200).send({
        message: "Rota atualizada com sucesso",
        data: response,
      });
    }

    const response = await Rota.create(data);

    return res.status(201).send({
      message: "Rota criada com sucesso",
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const destroy = async (req, res) => {
  try {
    const id = req.params.id
      ? req.params.id.toString().replace(/\D/g, "")
      : null;

    if (!id) {
      return res.status(400).send("ID é obrigatório");
    }

    const rota = await Rota.findByPk(id);
    if (!rota) {
      return res.status(404).send("Rota não encontrada");
    }

    await Rota.destroy({ where: { id } });

    return res.status(200).send({
      message: "Rota excluída com sucesso",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const getPontosRota = async (req, res) => {
  try {
    const { idRota } = req.params;

    const rota = await Rota.findByPk(idRota, {
      include: [
        {
          model: RotaPonto,
          as: "pontos",
          include: [
            {
              model: Ponto,
              as: "ponto",
              attributes: ["id", "nome", "endereco", "latitude", "longitude"],
            },
          ],
          order: [["ordem", "ASC"]],
        },
      ],
    });

    if (!rota) {
      return res.status(404).send({
        message: "Rota não encontrada",
      });
    }

    return res.status(200).send({
      message: "Pontos da rota encontrados",
      data: rota.pontos || [],
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const addPontoToRota = async (req, res) => {
  try {
    const { idRota } = req.params;
    const { idPonto, tipo, ordem } = req.body;

    const rota = await Rota.findByPk(idRota);
    if (!rota) {
      return res.status(404).send({
        message: "Rota não encontrada",
      });
    }

    const ponto = await Ponto.findByPk(idPonto);
    if (!ponto) {
      return res.status(404).send({
        message: "Ponto não encontrado",
      });
    }

    const existingRotaPonto = await RotaPonto.findOne({
      where: {
        idRota,
        idPonto,
        tipo,
      },
    });

    if (existingRotaPonto) {
      return res.status(400).send({
        message: `Este ponto já está cadastrado como ${tipo} nesta rota`,
      });
    }

    const rotaPonto = await RotaPonto.create({
      idRota,
      idPonto,
      tipo,
      ordem: ordem || 1,
      ativo: true,
    });

    return res.status(201).send({
      message: "Ponto adicionado à rota com sucesso",
      data: rotaPonto,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const removePontoFromRota = async (req, res) => {
  try {
    const { idRotaPonto } = req.params;

    const rotaPonto = await RotaPonto.findByPk(idRotaPonto);
    if (!rotaPonto) {
      return res.status(404).send({
        message: "Associação não encontrada",
      });
    }

    await rotaPonto.destroy();

    return res.status(200).send({
      message: "Ponto removido da rota com sucesso",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const updatePontoRota = async (req, res) => {
  try {
    const { idRotaPonto } = req.params;
    const { ordem, tipo, ativo } = req.body;

    const rotaPonto = await RotaPonto.findByPk(idRotaPonto);
    if (!rotaPonto) {
      return res.status(404).send({
        message: "Associação não encontrada",
      });
    }

    if (ordem !== undefined) rotaPonto.ordem = ordem;
    if (tipo !== undefined) rotaPonto.tipo = tipo;
    if (ativo !== undefined) rotaPonto.ativo = ativo;

    await rotaPonto.save();

    return res.status(200).send({
      message: "Ponto da rota atualizado com sucesso",
      data: rotaPonto,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const getPassageirosRota = async (req, res) => {
  try {
    const { idRota, tipo } = req.body; // 'embarque' ou 'desembarque'

    if (!idRota) {
      return res.status(400).send({
        message: "ID da rota é obrigatório",
      });
    }

    const hoje = new Date().toISOString().split("T")[0];

    const rota = await Rota.findByPk(idRota);
    if (!rota) {
      return res.status(404).send({
        message: "Rota não encontrada",
      });
    }

    const sessaoAtiva = await RotaSessao.findOne({
      where: {
        idRota,
        dataSessao: hoje,
      },
    });

    const whereClausePontos = { idRota };
    if (tipo) {
      whereClausePontos.tipo = tipo;
    }

    const pontosRota = await RotaPonto.findAll({
      where: whereClausePontos,
      include: [
        {
          model: Ponto,
          as: "ponto",
          attributes: ["id", "nome", "endereco"],
        },
      ],
      order: [["ordem", "ASC"]],
    });

    const alunosVinculados = await EmpresaAluno.findAll({
      where: {
        empresaId: rota.idEmpresa,
        ativo: true,
      },
      attributes: ["alunoId"],
    });

    const idsAlunosVinculados = alunosVinculados.map(
      (vinculo) => vinculo.alunoId
    );

    const passageirosHoje = await Aluno.findAll({
      where: {
        id: idsAlunosVinculados,
        pontoEmbarque: { [Op.ne]: null },
        pontoDesembarque: { [Op.ne]: null },
      },
      attributes: ["id", "nome", "email", "pontoEmbarque", "pontoDesembarque"],
      include: [
        {
          model: Ponto,
          as: "pontoEmbarqueObj",
          attributes: ["id", "nome"],
        },
        {
          model: Ponto,
          as: "pontoDesembarqueObj",
          attributes: ["id", "nome"],
        },
      ],
    });

    passageirosHoje.forEach(async (aluno) => {
      const registroExistente = await RotaPassageiro.findOne({
        where: {
          idRota,
          idAluno: aluno.id,
          dataEscolha: hoje,
        },
      });

      if (!registroExistente) {
        await RotaPassageiro.create({
          idRota,
          idAluno: aluno.id,
          pontoEmbarque: aluno.pontoEmbarque,
          pontoDesembarque: aluno.pontoDesembarque,
          dataEscolha: hoje,
          ativo: true,
        });
      }
    });
    const passageirosPorPonto = pontosRota.map((rotaPonto) => {
      const pontoId = rotaPonto.ponto.id;
      const tipoPonto = rotaPonto.tipo;

      const passageiros = passageirosHoje
        .filter((passageiro) => {
          if (tipoPonto === "embarque") {
            return passageiro.pontoEmbarque === pontoId;
          } else if (tipoPonto === "desembarque") {
            return passageiro.pontoDesembarque === pontoId;
          }
          return false;
        })
        .map((passageiro) => ({
          id: passageiro.id,
          nome: passageiro.nome,
          email: passageiro.email,
          pontoEmbarque: {
            id: passageiro.pontoEmbarqueObj?.id,
            nome: passageiro.pontoEmbarqueObj?.nome,
          },
          pontoDesembarque: {
            id: passageiro.pontoDesembarqueObj?.id,
            nome: passageiro.pontoDesembarqueObj?.nome,
          },
        }));

      return {
        ponto: {
          id: rotaPonto.ponto.id,
          nome: rotaPonto.ponto.nome,
          endereco: rotaPonto.ponto.endereco,
          ordem: rotaPonto.ordem,
          tipo: rotaPonto.tipo,
        },
        passageiros,
        totalPassageiros: passageiros.length,
      };
    });

    return res.status(200).send({
      message: "Passageiros da rota encontrados",
      data: {
        rota: {
          id: rota.id,
          nome: rota.nome,
        },
        sessao: sessaoAtiva
          ? {
              id: sessaoAtiva.id,
              status: sessaoAtiva.status,
              horarioLimite: sessaoAtiva.horarioLimiteEscolha,
              data: sessaoAtiva.dataSessao,
            }
          : null,
        tipo: tipo || "todos",
        data: hoje,
        pontosComPassageiros: passageirosPorPonto,
        totalPontos: passageirosPorPonto.length,
        totalPassageiros: passageirosPorPonto.reduce(
          (total, ponto) => total + ponto.totalPassageiros,
          0
        ),
      },
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

export default {
  get,
  getByEmpresa,
  persist,
  destroy,
  getPontosRota,
  addPontoToRota,
  removePontoFromRota,
  updatePontoRota,
  getPassageirosRota,
};
