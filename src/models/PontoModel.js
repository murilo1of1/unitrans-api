import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Empresa from "./EmpresaModel.js";

const Ponto = sequelize.define(
  "pontos",
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
    endereco: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DOUBLE,
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

Ponto.belongsTo(Empresa, {
  as: "empresa",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idEmpresa",
    allowNull: false,
    field: "id_empresa",
  },
});

export default Ponto;
