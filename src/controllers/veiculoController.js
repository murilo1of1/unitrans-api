import Veiculo from "../models/VeiculoModel.js";

const get = async (req, res) => {
  try {
    const id = req.params.id
      ? req.params.id.toString().replace(/\D/g, "")
      : null;

    if (!id) {
      const response = await Veiculo.findAll({
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

    const response = await Veiculo.findOne({
      where: {
        id: id,
      },
      include: [
        {
          association: "empresa",
          attributes: ["id", "nome", "cnpj"],
        },
      ],
    });

    if (!response) {
      return res.status(404).send("Veículo não encontrado");
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

    const response = await Veiculo.findAll({
      where: {
        idEmpresa: idEmpresa,
      },
      order: [["id", "desc"]],
    });

    return res.status(200).send({
      message: "Veículos da empresa encontrados",
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const create = async (corpo) => {
  try {
    const { descricao, placa, modelo, capacidade, idEmpresa } = corpo;

    const response = await Veiculo.create({
      descricao,
      placa,
      modelo,
      capacidade,
      idEmpresa,
    });

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (corpo, id) => {
  try {
    const response = await Veiculo.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      throw new Error("Veículo não encontrado");
    }

    Object.keys(corpo).forEach((item) => (response[item] = corpo[item]));
    await response.save();

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const persist = async (req, res) => {
  try {
    const id = req.params.id
      ? req.params.id.toString().replace(/\D/g, "")
      : null;

    if (!id) {
      const response = await create(req.body);
      return res.status(201).send({
        message: "Veículo criado com sucesso!",
        data: response,
      });
    }

    const response = await update(req.body, id);
    return res.status(200).send({
      message: "Veículo atualizado com sucesso!",
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
      return res.status(400).send("ID do veículo é obrigatório");
    }

    const response = await Veiculo.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      return res.status(404).send("Veículo não encontrado");
    }

    await response.destroy();

    return res.status(200).send({
      message: "Veículo excluído com sucesso",
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
};
