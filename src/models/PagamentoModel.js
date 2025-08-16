import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Aluno from "./AlunoModel.js";
import Plano from "./PlanoModel.js";

const Pagamento = sequelize.define(
  "pagamentos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    stripePaymentId: {
      field: "stripe_payment_id",
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pendente", "pago", "falhou"),
      allowNull: false,
      defaultValue: "pendente",
    },
    dataPagamento: {
      field: "data_pagamento",
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Pagamento.belongsTo(Aluno, {
  as: "aluno",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idAluno",
    allowNull: false,
    field: "id_aluno",
  },
});

Pagamento.belongsTo(Plano, {
  as: "plano",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idPlano",
    allowNull: false,
    field: "id_plano",
  },
});

export default Pagamento;
