import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Empresa from "./EmpresaModel.js";
import Aluno from "./AlunoModel.js";

const EmpresaAluno = sequelize.define(
  "empresa_aluno",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    alunoId: {
      field: "aluno_id", 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "alunos",
        key: "id",
      },
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    dataVinculo: {
      field: "data_vinculo",
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    dataDesvinculo: {
      field: "data_desvinculo",
      type: DataTypes.DATE,
      allowNull: true,
    },
    origemVinculo: {
      field: "origem_vinculo",
      type: DataTypes.ENUM('token', 'solicitacao'),
      allowNull: false,
    },
    vinculadoPor: {
      field: "vinculado_por",
      type: DataTypes.STRING,
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
        fields: ["empresa_id", "aluno_id"],
        name: "unique_empresa_aluno",
      },
    ],
  }
);

EmpresaAluno.belongsTo(Empresa, {
  as: "empresa",
  foreignKey: "empresaId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

EmpresaAluno.belongsTo(Aluno, {
  as: "aluno", 
  foreignKey: "alunoId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

export default EmpresaAluno;
