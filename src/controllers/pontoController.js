import Ponto from "../models/PontoModel.js";
import Empresa from "../models/EmpresaModel.js";
import RotaPonto from "../models/RotaPontoModel.js";
import Rota from "../models/RotaModel.js";

const get = async (req, res) => {
  try {
    const id = req.params.id
      ? req.params.id.toString().replace(/\D/g, "")
      : null;

    if (!id) {
      const response = await Ponto.findAll({
        order: [["nome", "asc"]],
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

    const response = await Ponto.findOne({
      where: { id },
      include: [
        {
          association: "empresa",
          attributes: ["id", "nome", "cnpj"],
        },
      ],
    });

    if (!response) {
      return res.status(404).send("Ponto não encontrado");
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

    const response = await Ponto.findAll({
      where: { idEmpresa },
      order: [["nome", "asc"]],
    });

    return res.status(200).send({
      message: "Pontos da empresa encontrados",
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

    const { nome, endereco, latitude, longitude, idEmpresa } = req.body;

    if (!nome || !idEmpresa) {
      return res.status(400).send("Nome e ID da empresa são obrigatórios");
    }

    const empresa = await Empresa.findByPk(idEmpresa);
    if (!empresa) {
      return res.status(404).send("Empresa não encontrada");
    }

    const data = { nome, endereco, latitude, longitude, idEmpresa };

    if (id) {
      await Ponto.update(data, { where: { id } });
      const response = await Ponto.findByPk(id);

      return res.status(200).send({
        message: "Ponto atualizado com sucesso",
        data: response,
      });
    }

    const response = await Ponto.create(data);

    return res.status(201).send({
      message: "Ponto criado com sucesso",
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

    const ponto = await Ponto.findByPk(id);
    if (!ponto) {
      return res.status(404).send("Ponto não encontrado");
    }

    const rotaPontos = await RotaPonto.findAll({ where: { idPonto: id } });
    if (rotaPontos.length > 0) {
      return res
        .status(400)
        .send("Não é possível excluir ponto vinculado a rotas");
    }

    await Ponto.destroy({ where: { id } });

    return res.status(200).send({
      message: "Ponto excluído com sucesso",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const addToRota = async (req, res) => {
  try {
    const { idRota, idPonto, ordem, tipo } = req.body;

    if (!idRota || !idPonto || !ordem || !tipo) {
      return res.status(400).send("Dados obrigatórios não informados");
    }

    if (!["embarque", "desembarque"].includes(tipo)) {
      return res.status(400).send("Tipo deve ser 'embarque' ou 'desembarque'");
    }

    const rota = await Rota.findByPk(idRota);
    if (!rota) {
      return res.status(404).send("Rota não encontrada");
    }

    const ponto = await Ponto.findByPk(idPonto);
    if (!ponto) {
      return res.status(404).send("Ponto não encontrado");
    }

    const existeRelacao = await RotaPonto.findOne({
      where: { idRota, idPonto, tipo },
    });

    if (existeRelacao) {
      return res
        .status(400)
        .send("Ponto já vinculado a esta rota com este tipo");
    }

    const response = await RotaPonto.create({
      idRota,
      idPonto,
      ordem,
      tipo,
      ativo: true,
    });

    return res.status(201).send({
      message: "Ponto adicionado à rota com sucesso",
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const removeFromRota = async (req, res) => {
  try {
    const id = req.params.id
      ? req.params.id.toString().replace(/\D/g, "")
      : null;

    if (!id) {
      return res.status(400).send("ID é obrigatório");
    }

    const rotaPonto = await RotaPonto.findByPk(id);
    if (!rotaPonto) {
      return res.status(404).send("Relação não encontrada");
    }

    await RotaPonto.destroy({ where: { id } });

    return res.status(200).send({
      message: "Ponto removido da rota com sucesso",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const toggleAtivo = async (req, res) => {
  try {
    const id = req.params.id
      ? req.params.id.toString().replace(/\D/g, "")
      : null;

    if (!id) {
      return res.status(400).send("ID é obrigatório");
    }

    const rotaPonto = await RotaPonto.findByPk(id);
    if (!rotaPonto) {
      return res.status(404).send("Relação não encontrada");
    }

    await RotaPonto.update({ ativo: !rotaPonto.ativo }, { where: { id } });

    const response = await RotaPonto.findByPk(id);

    return res.status(200).send({
      message: `Ponto ${response.ativo ? "ativado" : "desativado"} com sucesso`,
      data: response,
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
  addToRota,
  removeFromRota,
  toggleAtivo,
};
