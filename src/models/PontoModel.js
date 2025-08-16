import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Rota from "./RotaModel.js";

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
    ordem: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

Ponto.belongsTo(Rota, {
  as: "rota",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idRota",
    allowNull: false,
    field: "id_rota",
  },
});

export default Ponto;
