import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Empresa from "./EmpresaModel.js";

const TokenAcesso = sequelize.define(
  "token_acesso",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    dataExpiracao: {
      field: "data_expiracao",
      type: DataTypes.DATE,
      allowNull: false,
    },
    usoUnico: {
      field: "uso_unico",
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    usado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    usadoEm: {
      field: "usado_em",
      type: DataTypes.DATE,
      allowNull: true,
    },
    usadoPor: {
      field: "usado_por",
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "alunos",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

TokenAcesso.belongsTo(Empresa, {
  as: "empresa",
  foreignKey: "empresaId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

export default TokenAcesso;
