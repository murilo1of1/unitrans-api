import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Empresa from "./EmpresaModel.js";
import Aluno from "./AlunoModel.js";

const SolicitacaoVinculo = sequelize.define(
  "solicitacao_vinculo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    alunoId: {
      field: "aluno_id",
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "alunos",
        key: "id",
      },
    },
    empresaId: {
      field: "empresa_id", 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "empresas",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM('pendente', 'aprovado', 'rejeitado'),
      defaultValue: 'pendente',
      allowNull: false,
    },
    solicitadoEm: {
      field: "solicitado_em",
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    respondidoEm: {
      field: "respondido_em",
      type: DataTypes.DATE,
      allowNull: true,
    },
    motivoRejeicao: {
      field: "motivo_rejeicao",
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["aluno_id", "empresa_id"],
        name: "unique_solicitacao_aluno_empresa",
        where: {
          status: 'pendente'
        }
      },
    ],
  }
);

SolicitacaoVinculo.belongsTo(Aluno, {
  as: "aluno",
  foreignKey: "alunoId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

SolicitacaoVinculo.belongsTo(Empresa, {
  as: "empresa",
  foreignKey: "empresaId", 
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

export default SolicitacaoVinculo;
