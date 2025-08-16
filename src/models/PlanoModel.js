import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Empresa from "./EmpresaModel.js";

const Plano = sequelize.define(
  "planos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    precoIda: {
      field: "preco_ida",
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    precoVolta: {
      field: "preco_volta",
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    precoPadrao: {
      field: "preco_padrao",
      type: DataTypes.DECIMAL(10, 2),
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

Plano.belongsTo(Empresa, {
  as: "empresa",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idEmpresa",
    allowNull: false,
    field: "id_empresa",
  },
});

export default Plano;
