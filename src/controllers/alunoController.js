import Aluno from "../models/AlunoModel.js";
import RotaPassageiro from "../models/RotaPassageiroModel.js";
import Ponto from "../models/PontoModel.js";
import Rota from "../models/RotaModel.js";
import EmpresaAluno from "../models/EmpresaAlunoModel.js";
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
      const response = await Aluno.findAll({
        order: [["id", "desc"]],
        attributes: { exclude: ["passwordHash"] },
      });

      return res.status(200).send({
        message: "Dados encontrados",
        data: response,
      });
    }

    const response = await Aluno.findOne({
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
    const { nome, email, senha, token, idEmpresa, idPlano, cpf } = corpo;

    let passwordHash = null;
    if (senha) {
      passwordHash = await bcrypt.hash(senha, 10);
    }

    const response = await Aluno.create({
      nome,
      email,
      passwordHash,
      token,
      cpf,
      idEmpresa,
      idPlano,
    });

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (corpo, id) => {
  try {
    const response = await Aluno.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      throw new Error("Nao achou");
    }

    if (corpo.senha) {
      corpo.passwordHash = await bcrypt.hash(corpo.senha, 10);
      delete corpo.senha;
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

    const response = await Aluno.findOne({
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

    const aluno = await Aluno.findOne({
      where: {
        email,
      },
    });

    if (!aluno) {
      return res.status(400).send({
        message: "Email não encontrado",
      });
    }

    if (!aluno.passwordHash) {
      return res.status(400).send({
        message: "Aluno não possui senha cadastrada",
      });
    }

    const comparacaoSenha = await bcrypt.compare(senha, aluno.passwordHash);

    if (comparacaoSenha) {
      const token = jwt.sign(
        {
          idAluno: aluno.id,
          nome: aluno.nome,
          email: aluno.email,
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
    return res.status(500).send({
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const aluno = await Aluno.findOne({ where: { email } });

    if (aluno) {
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetPasswordExpires = Date.now() + 30 * 60 * 1000;

      await Aluno.update(
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

    const aluno = await Aluno.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!aluno) {
      return res
        .status(400)
        .send({ message: "Código de recuperação inválido ou expirado." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await Aluno.update(
      {
        passwordHash: passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { where: { id: aluno.id } }
    );

    return res.status(200).send({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Salvar escolhas de embarque e desembarque do aluno
const salvarEscolhasPontos = async (req, res) => {
  try {
    console.log("Dados recebidos no backend:", req.body);
    const { idAluno, idRota, pontoEmbarque, pontoDesembarque } = req.body;
    console.log("Campos extraídos:", {
      idAluno,
      idRota,
      pontoEmbarque,
      pontoDesembarque,
    });

    if (!idAluno || !idRota || !pontoEmbarque || !pontoDesembarque) {
      return res.status(400).send({
        message:
          "Todos os campos são obrigatórios: idAluno, idRota, pontoEmbarque, pontoDesembarque",
      });
    }

    // Verificar se o aluno existe
    const aluno = await Aluno.findByPk(idAluno);
    if (!aluno) {
      return res.status(404).send({
        message: "Aluno não encontrado",
      });
    }

    // Verificar se a rota existe
    const rota = await Rota.findByPk(idRota);
    if (!rota) {
      return res.status(404).send({
        message: "Rota não encontrada",
      });
    }

    // Verificar se o aluno está vinculado à empresa da rota
    const vinculo = await EmpresaAluno.findOne({
      where: {
        alunoId: idAluno,
        empresaId: rota.idEmpresa,
        ativo: true,
      },
    });

    if (!vinculo) {
      return res.status(403).send({
        message: "Aluno não está vinculado à empresa desta rota",
      });
    }

    // Verificar se os pontos existem
    const pontoEmb = await Ponto.findByPk(pontoEmbarque);
    const pontoDes = await Ponto.findByPk(pontoDesembarque);

    if (!pontoEmb || !pontoDes) {
      return res.status(404).send({
        message: "Um ou ambos os pontos não foram encontrados",
      });
    }

    // Atualizar escolhas atuais do aluno
    await aluno.update({
      pontoEmbarque: pontoEmbarque,
      pontoDesembarque: pontoDesembarque,
    });

    // Data atual para criar registro histórico
    const hoje = new Date().toISOString().split("T")[0];

    // Verificar se já existe um registro para hoje
    const registroExistente = await RotaPassageiro.findOne({
      where: {
        idRota,
        idAluno,
        dataEscolha: hoje,
      },
    });

    if (registroExistente) {
      // Atualizar registro existente
      await registroExistente.update({
        pontoEmbarque,
        pontoDesembarque,
        ativo: true,
      });
    } else {
      // Criar novo registro histórico
      await RotaPassageiro.create({
        idRota,
        idAluno,
        pontoEmbarque,
        pontoDesembarque,
        dataEscolha: hoje,
        ativo: true,
      });
    }

    return res.status(200).send({
      message: "Escolhas salvas com sucesso",
      data: {
        aluno: {
          id: aluno.id,
          nome: aluno.nome,
          pontoEmbarque: pontoEmb.nome,
          pontoDesembarque: pontoDes.nome,
        },
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
  persist,
  destroy,
  login,
  resetPassword,
  forgotPassword,
  salvarEscolhasPontos,
};
