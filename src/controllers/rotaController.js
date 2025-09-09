import Rota from "../models/RotaModel.js";
import Veiculo from "../models/VeiculoModel.js";
import Empresa from "../models/EmpresaModel.js";
import RotaPonto from "../models/RotaPontoModel.js";
import Ponto from "../models/PontoModel.js";

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

const getByVeiculo = async (req, res) => {
  try {
    const idVeiculo = req.params.idVeiculo
      ? req.params.idVeiculo.toString().replace(/\D/g, "")
      : null;

    if (!idVeiculo) {
      return res.status(400).send("ID do veículo é obrigatório");
    }

    const response = await Rota.findAll({
      include: [
        {
          model: Veiculo,
          as: "veiculo",
          where: { id: idVeiculo },
          attributes: ["id", "descricao", "placa"],
        },
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
      order: [["tipo", "asc"]],
    });

    return res.status(200).send({
      message: "Rotas do veículo encontradas",
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

    if (!nome || !origem || !destino || !tipo || !idEmpresa) {
      return res.status(400).send("Dados obrigatórios não informados");
    }

    if (!["ida", "volta"].includes(tipo)) {
      return res.status(400).send("Tipo deve ser 'ida' ou 'volta'");
    }

    const empresa = await Empresa.findByPk(idEmpresa);
    if (!empresa) {
      return res.status(404).send("Empresa não encontrada");
    }

    const data = { nome, origem, destino, tipo, idEmpresa };

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

export default {
  get,
  getByEmpresa,
  getByVeiculo,
  persist,
  destroy,
};
