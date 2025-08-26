import EmpresaAluno from "../models/EmpresaAlunoModel.js";
import TokenAcesso from "../models/TokenAcessoModel.js";
import SolicitacaoVinculo from "../models/SolicitacaoVinculoModel.js";
import Empresa from "../models/EmpresaModel.js";
import Aluno from "../models/AlunoModel.js";
import { Op } from "sequelize";
import crypto from "crypto";
import bcrypt from "bcrypt";

const criarVinculo = async (req, res) => {
  try {
    const { empresaId, alunoId, origemVinculo, vinculadoPor } = req.body;

    const vinculoExistente = await EmpresaAluno.findOne({
      where: {
        empresaId,
        alunoId,
        ativo: true,
      },
    });

    if (vinculoExistente) {
      return res.status(400).send({
        message: "Vínculo já existe entre este aluno e empresa",
      });
    }

    const vinculo = await EmpresaAluno.create({
      empresaId,
      alunoId,
      origemVinculo,
      vinculadoPor,
    });

    const vinculoCompleto = await EmpresaAluno.findByPk(vinculo.id, {
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome"] },
        { model: Aluno, as: "aluno", attributes: ["id", "nome", "email"] },
      ],
    });

    return res.status(201).send({
      message: "Vínculo criado com sucesso!",
      data: vinculoCompleto,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const listarVinculos = async (req, res) => {
  try {
    const { alunoId, empresaId, ativo } = req.query;
    
    const where = {};
    if (alunoId) where.alunoId = alunoId;
    if (empresaId) where.empresaId = empresaId;
    if (ativo !== undefined) where.ativo = ativo === 'true';

    const vinculos = await EmpresaAluno.findAll({
      where,
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome", "email"] },
        { model: Aluno, as: "aluno", attributes: ["id", "nome", "email"] },
      ],
      order: [["dataVinculo", "DESC"]],
    });

    return res.status(200).send({
      message: "Vínculos encontrados",
      data: vinculos,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const listarVinculosAluno = async (req, res) => {
  try {
    const { idAluno } = req.params;
    const { ativo } = req.query;
    
    const where = { alunoId: idAluno };
    if (ativo !== undefined) where.ativo = ativo === 'true';

    const vinculos = await EmpresaAluno.findAll({
      where,
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome", "email"] },
        { model: Aluno, as: "aluno", attributes: ["id", "nome", "email"] },
      ],
      order: [["dataVinculo", "DESC"]],
    });

    return res.status(200).send({
      message: "Vínculos do aluno encontrados",
      data: vinculos,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const listarVinculosEmpresa = async (req, res) => {
  try {
    const { idEmpresa } = req.params;
    const { ativo } = req.query;
    
    const where = { empresaId: idEmpresa };
    if (ativo !== undefined) where.ativo = ativo === 'true';

    const vinculos = await EmpresaAluno.findAll({
      where,
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome", "email"] },
        { model: Aluno, as: "aluno", attributes: ["id", "nome", "email"] },
      ],
      order: [["dataVinculo", "DESC"]],
    });

    return res.status(200).send({
      message: "Vínculos da empresa encontrados",
      data: vinculos,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const desativarVinculo = async (req, res) => {
  try {
    const { id } = req.params;

    const vinculo = await EmpresaAluno.findByPk(id);
    if (!vinculo) {
      return res.status(404).send({
        message: "Vínculo não encontrado",
      });
    }

    await vinculo.update({
      ativo: false,
      dataDesvinculo: new Date(),
    });

    return res.status(200).send({
      message: "Vínculo desativado com sucesso!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const reativarVinculo = async (req, res) => {
  try {
    const { id } = req.params;

    const vinculo = await EmpresaAluno.findByPk(id);
    if (!vinculo) {
      return res.status(404).send({
        message: "Vínculo não encontrado",
      });
    }

    await vinculo.update({
      ativo: true,
      dataDesvinculo: null,
    });

    return res.status(200).send({
      message: "Vínculo reativado com sucesso!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const gerarToken = async (req, res) => {
  try {
    const { empresaId } = req.body;

    // Verificar se empresa existe
    const empresa = await Empresa.findByPk(empresaId);
    if (!empresa) {
      return res.status(404).send({
        message: "Empresa não encontrada",
      });
    }

    // Gerar token único de 8 caracteres
    const tokenPlain = crypto.randomBytes(4).toString('hex').toUpperCase();
    const tokenHash = await bcrypt.hash(tokenPlain, 10);
    
    // Data de expiração: 30 minutos
    const dataExpiracao = new Date();
    dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 30);

    const tokenAcesso = await TokenAcesso.create({
      token: tokenHash,
      empresaId,
      dataExpiracao,
    });

    return res.status(201).send({
      message: "Token de acesso gerado com sucesso!",
      data: {
        token: tokenPlain, // Retorna o token plain para o usuário
        expiraEm: tokenAcesso.dataExpiracao,
        empresa: empresa.nome,
      },
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const listarTokens = async (req, res) => {
  try {
    const { empresaId } = req.query;

    const where = {};
    if (empresaId) where.empresaId = empresaId;

    const tokens = await TokenAcesso.findAll({
      where,
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome"] },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).send({
      message: "Tokens encontrados",
      data: tokens,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const listarTokensEmpresa = async (req, res) => {
  try {
    const { idEmpresa } = req.params;

    const tokens = await TokenAcesso.findAll({
      where: { empresaId: idEmpresa },
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome"] },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).send({
      message: "Tokens da empresa encontrados",
      data: tokens,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const revogarToken = async (req, res) => {
  try {
    const { id } = req.params;

    const token = await TokenAcesso.findByPk(id);
    if (!token) {
      return res.status(404).send({
        message: "Token não encontrado",
      });
    }

    await token.update({ ativo: false });

    return res.status(200).send({
      message: "Token revogado com sucesso!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const vincularPorToken = async (req, res) => {
  try {
    const { token, alunoId } = req.body;

    // Buscar todos os tokens ativos da empresa
    const tokensAtivos = await TokenAcesso.findAll({
      where: { ativo: true },
      include: [{ model: Empresa, as: "empresa" }],
    });

    // Verificar qual token corresponde ao hash
    let tokenAcesso = null;
    for (const t of tokensAtivos) {
      const isValid = await bcrypt.compare(token, t.token);
      if (isValid) {
        tokenAcesso = t;
        break;
      }
    }

    if (!tokenAcesso) {
      return res.status(404).send({
        message: "Token inválido ou inativo",
      });
    }

    // Verificar se token expirou
    if (new Date() > tokenAcesso.dataExpiracao) {
      return res.status(400).send({
        message: "Token expirado",
      });
    }

    // Verificar se token já foi usado (se for uso único)
    if (tokenAcesso.usoUnico && tokenAcesso.usado) {
      return res.status(400).send({
        message: "Token já foi utilizado",
      });
    }

    // Verificar se já existe vínculo ativo entre MESMO aluno e MESMA empresa
    const vinculoExistente = await EmpresaAluno.findOne({
      where: {
        empresaId: tokenAcesso.empresaId,
        alunoId,
        ativo: true,
      },
    });

    if (vinculoExistente) {
      return res.status(400).send({
        message: "Vínculo já existe entre este aluno e empresa",
      });
    }

    // Criar vínculo
    const vinculo = await EmpresaAluno.create({
      empresaId: tokenAcesso.empresaId,
      alunoId,
      origemVinculo: 'token',
      vinculadoPor: tokenAcesso.id.toString(),
    });

    // Marcar token como usado
    await tokenAcesso.update({
      usado: true,
      usadoEm: new Date(),
      usadoPor: alunoId,
    });

    const vinculoCompleto = await EmpresaAluno.findByPk(vinculo.id, {
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome"] },
        { model: Aluno, as: "aluno", attributes: ["id", "nome", "email"] },
      ],
    });

    return res.status(201).send({
      message: "Vínculo criado via token com sucesso!",
      data: vinculoCompleto,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const solicitarVinculo = async (req, res) => {
  try {
    const { alunoId, empresaId } = req.body;

    const empresa = await Empresa.findByPk(empresaId);
    if (!empresa) {
      return res.status(404).send({
        message: "Empresa não encontrada",
      });
    }

    // Verificar se já existe vínculo ativo entre MESMO aluno e MESMA empresa
    const vinculoExistente = await EmpresaAluno.findOne({
      where: {
        empresaId,
        alunoId,
        ativo: true,
      },
    });

    if (vinculoExistente) {
      return res.status(400).send({
        message: "Vínculo já existe entre este aluno e empresa",
      });
    }

    const solicitacaoExistente = await SolicitacaoVinculo.findOne({
      where: {
        empresaId,
        alunoId,
        status: 'pendente',
      },
    });

    if (solicitacaoExistente) {
      return res.status(400).send({
        message: "Já existe uma solicitação pendente para esta empresa",
      });
    }

    const solicitacao = await SolicitacaoVinculo.create({
      alunoId,
      empresaId,
    });

    const solicitacaoCompleta = await SolicitacaoVinculo.findByPk(solicitacao.id, {
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome"] },
        { model: Aluno, as: "aluno", attributes: ["id", "nome", "email"] },
      ],
    });

    return res.status(201).send({
      message: "Solicitação de vínculo enviada com sucesso!",
      data: solicitacaoCompleta,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const listarSolicitacoes = async (req, res) => {
  try {
    const { empresaId, alunoId, status } = req.query;

    const where = {};
    if (empresaId) where.empresaId = empresaId;
    if (alunoId) where.alunoId = alunoId;
    if (status) where.status = status;

    const solicitacoes = await SolicitacaoVinculo.findAll({
      where,
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome", "email"] },
        { model: Aluno, as: "aluno", attributes: ["id", "nome", "email"] },
      ],
      order: [["solicitadoEm", "DESC"]],
    });

    return res.status(200).send({
      message: "Solicitações encontradas",
      data: solicitacoes,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const listarSolicitacoesEmpresa = async (req, res) => {
  try {
    const { idEmpresa } = req.params;
    const { status } = req.query;

    const where = { empresaId: idEmpresa };
    if (status) where.status = status;

    const solicitacoes = await SolicitacaoVinculo.findAll({
      where,
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome", "email"] },
        { model: Aluno, as: "aluno", attributes: ["id", "nome", "email"] },
      ],
      order: [["solicitadoEm", "DESC"]],
    });

    return res.status(200).send({
      message: "Solicitações da empresa encontradas",
      data: solicitacoes,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const listarSolicitacoesAluno = async (req, res) => {
  try {
    const { idAluno } = req.params;
    const { status } = req.query;

    const where = { alunoId: idAluno };
    if (status) where.status = status;

    const solicitacoes = await SolicitacaoVinculo.findAll({
      where,
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome", "email"] },
        { model: Aluno, as: "aluno", attributes: ["id", "nome", "email"] },
      ],
      order: [["solicitadoEm", "DESC"]],
    });

    return res.status(200).send({
      message: "Solicitações do aluno encontradas",
      data: solicitacoes,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const aprovarSolicitacao = async (req, res) => {
  try {
    const { id } = req.params;

    const solicitacao = await SolicitacaoVinculo.findByPk(id);
    if (!solicitacao) {
      return res.status(404).send({
        message: "Solicitação não encontrada",
      });
    }

    if (solicitacao.status !== 'pendente') {
      return res.status(400).send({
        message: "Solicitação já foi respondida",
      });
    }

    const vinculoExistente = await EmpresaAluno.findOne({
      where: {
        empresaId: solicitacao.empresaId,
        alunoId: solicitacao.alunoId,
        ativo: true,
      },
    });

    if (vinculoExistente) {
      return res.status(400).send({
        message: "Vínculo já existe entre este aluno e empresa",
      });
    }

    await solicitacao.update({
      status: 'aprovado',
      respondidoEm: new Date(),
    });

    const vinculo = await EmpresaAluno.create({
      empresaId: solicitacao.empresaId,
      alunoId: solicitacao.alunoId,
      origemVinculo: 'solicitacao',
      vinculadoPor: id.toString(),
    });

    const vinculoCompleto = await EmpresaAluno.findByPk(vinculo.id, {
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome"] },
        { model: Aluno, as: "aluno", attributes: ["id", "nome", "email"] },
      ],
    });

    return res.status(200).send({
      message: "Solicitação aprovada e vínculo criado com sucesso!",
      data: vinculoCompleto,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

const rejeitarSolicitacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivoRejeicao } = req.body;

    const solicitacao = await SolicitacaoVinculo.findByPk(id);
    if (!solicitacao) {
      return res.status(404).send({
        message: "Solicitação não encontrada",
      });
    }

    if (solicitacao.status !== 'pendente') {
      return res.status(400).send({
        message: "Solicitação já foi respondida",
      });
    }

    await solicitacao.update({
      status: 'rejeitado',
      respondidoEm: new Date(),
      motivoRejeicao,
    });

    return res.status(200).send({
      message: "Solicitação rejeitada com sucesso!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

export default {
  // Gestão de vínculos
  criarVinculo,
  listarVinculos,
  listarVinculosAluno,
  listarVinculosEmpresa,
  desativarVinculo,
  reativarVinculo,
  
  // Gestão de tokens
  gerarToken,
  listarTokens,
  listarTokensEmpresa,
  revogarToken,
  vincularPorToken,
  
  // Gestão de solicitações
  solicitarVinculo,
  listarSolicitacoes,
  listarSolicitacoesEmpresa,
  listarSolicitacoesAluno,
  aprovarSolicitacao,
  rejeitarSolicitacao,
};
