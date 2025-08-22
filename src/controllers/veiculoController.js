import Veiculo from "../models/VeiculoModel.js";
import path from "path";
import fs from "fs";

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
    const { descricao, placa, modelo, capacidade, idEmpresa, imagem } = corpo;

    const response = await Veiculo.create({
      descricao,
      placa,
      modelo,
      capacidade,
      idEmpresa,
      imagem,
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
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (!id) {
      const processedData = {};
      Object.keys(req.body).forEach((key) => {
        const value = req.body[key];
        processedData[key] = Array.isArray(value) ? value[0] : value;
      });

      const data = { ...processedData, imagem: null };
      const response = await create(data);

      if (req.files && req.files.imagem) {
        const image = req.files.imagem;
        const ext = path.extname(image.name);
        const uploadDir = path.join(process.cwd(), "public");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileName = `veiculo_${response.id}${ext}`;
        await image.mv(path.join(uploadDir, fileName));

        response.imagem = `${baseUrl}/${fileName}`;
        await response.save();
      }

      return res.status(201).send({
        message: "Veículo criado com sucesso!",
        data: response,
      });
    }

    let imagePath = null;
    if (req.files && req.files.imagem) {
      const image = req.files.imagem;
      const ext = path.extname(image.name);
      const uploadDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `veiculo_${id}${ext}`;
      await image.mv(path.join(uploadDir, fileName));
      imagePath = `${baseUrl}/${fileName}`;
    }

    const data = {
      ...req.body,
      ...(imagePath && { imagem: imagePath }),
    };
    const response = await update(data, id);
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
