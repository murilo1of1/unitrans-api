import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Empresa from "./EmpresaModel.js";
import Plano from "./PlanoModel.js";

const Aluno = sequelize.define(
  "alunos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,   
      validate: {
        isEmail: true,
      },
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      field: "password_hash",
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      field: "reset_password_token",
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      field: "reset_password_expires",
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Aluno.belongsTo(Empresa, {
  as: "empresa",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idEmpresa",
    allowNull: true,
    field: "id_empresa",
  },
});

Aluno.belongsTo(Plano, {
  as: "plano",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idPlano",
    allowNull: true,
    field: "id_plano",
  },
});

export default Aluno;
