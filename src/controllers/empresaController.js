import Empresa from "../models/EmpresaModel";
import bcrypt from "bcrypt";

const get = async (req, res) => {
  try {
    const id = req.params.id
      ? req.params.id.toString().replace(/\D/g, "")
      : null;

    if (!id) {
      const response = await Empresa.findAll({
        order: [["id", "desc"]],
        attributes: { exclude: ["passwordHash"] },
      });

      return res.status(200).send({
        message: "Dados encontrados",
        data: response,
      });
    }

    const response = await Empresa.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ["passwordHash"] },
    });

    if (!response) {
      return res.status(404).send("nao achou");
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

const create = async (corpo) => {
  try {
    const { nome, cnpj, email, senha, stripeAccountId } = corpo;

    const passwordHash = await bcrypt.hash(senha, 10);

    const response = await Empresa.create({
      nome,
      cnpj,
      email,
      passwordHash,
      stripeAccountId,
    });

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (corpo, id) => {
  try {
    const response = await Empresa.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      throw new Error("Nao achou");
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
        message: "criado com sucesso!",
        data: response,
      });
    }

    const response = await update(req.body, id);
    return res.status(201).send({
      message: "atualizado com sucesso!",
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
      return res.status(400).send("informa ai paezao");
    }

    const response = await Empresa.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      return res.status(404).send("nao achou");
    }

    await response.destroy();

    return res.status(200).send({
      message: "registro excluido",
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
  persist,
  destroy,
};
