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
      unique: true,
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
    pontoEmbarque: {
      field: "ponto_embarque",
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "pontos",
        key: "id",
      },
    },
    pontoDesembarque: {
      field: "ponto_desembarque",
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "pontos",
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

// Associações com pontos de embarque e desembarque
import Ponto from "./PontoModel.js";

Aluno.belongsTo(Ponto, {
  as: "pontoEmbarqueObj",
  onUpdate: "NO ACTION",
  onDelete: "SET NULL",
  foreignKey: {
    name: "pontoEmbarque",
    allowNull: true,
    field: "ponto_embarque",
  },
});

Aluno.belongsTo(Ponto, {
  as: "pontoDesembarqueObj",
  onUpdate: "NO ACTION",
  onDelete: "SET NULL",
  foreignKey: {
    name: "pontoDesembarque",
    allowNull: true,
    field: "ponto_desembarque",
  },
});

export default Aluno;
