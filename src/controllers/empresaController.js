import Empresa from "../models/EmpresaModel.js";
import bcrypt from "bcrypt";
import sendMail from "../utils/email.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const get = async (req, res) => {
  try {
    const id = req.params.id
      ? req.params.id.toString().replace(/\D/g, "")
      : null;

    if (!id) {
      const response = await Empresa.findAll({
        where: {
          tipoVinculo: {
            [Op.in]: ['ambos', 'pesquisa']
          }
        },
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

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const empresa = await Empresa.findOne({
      where: {
        email,
      },
    });

    if (!empresa) {
      return res.status(400).send({
        message: "Email não encontrado",
      });
    }

    const comparacaoSenha = await bcrypt.compare(senha, empresa.passwordHash);

    if (comparacaoSenha) {
      const token = jwt.sign(
        {
          idEmpresa: empresa.id,
          nome: empresa.nome,
          email: empresa.email,
        },
        process.env.TOKEN_KEY,
        { expiresIn: "8h" }
      );
      return res.status(200).send({
        message: "Sucesso",
        response: token,
      });
    } else {
      return res.status(400).send({
        message: "usuario ou senha incorretos",
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const empresa = await Empresa.findOne({ where: { email } });

    if (empresa) {
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetPasswordExpires = Date.now() + 30 * 60 * 1000;

      await Empresa.update(
        {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetPasswordExpires,
        },
        { where: { email } }
      );

      console.log(email);

      const mailOptions = {
        to: email,
        subject: "Recuperação de Senha",
        html: `<p>Você solicitou a recuperação de sua senha. Seu código temporário é: <strong>${resetToken}</strong>. Ele expirará em 30 minutos.</p>`,
      };

      await sendMail(
        mailOptions.to,
        mailOptions.name,
        mailOptions.html,
        mailOptions.subject
      );

      return res.status(200).send({
        message:
          "Um e-mail com as instruções de recuperação foi enviado (se o e-mail existir em nosso sistema).",
      });
    } else {
      return res.status(200).send({
        message:
          "Um e-mail com as instruções de recuperação foi enviado (se o e-mail existir em nosso sistema).",
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const empresa = await Empresa.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!empresa) {
      return res
        .status(400)
        .send({ message: "Código de recuperação inválido ou expirado." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await Empresa.update(
      {
        passwordHash: passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { where: { id: empresa.id } }
    );

    return res.status(200).send({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export default {
  get,
  persist,
  destroy,
  login,
  resetPassword,
  forgotPassword,
};
