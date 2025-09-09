import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Rota from "./RotaModel.js";
import Ponto from "./PontoModel.js";

const RotaPonto = sequelize.define(
  "rota_pontos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ordem: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("embarque", "desembarque"),
      allowNull: false,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

RotaPonto.belongsTo(Rota, {
  as: "rota",
  onUpdate: "NO ACTION",
  onDelete: "CASCADE",
  foreignKey: {
    name: "idRota",
    allowNull: false,
    field: "id_rota",
  },
});

RotaPonto.belongsTo(Ponto, {
  as: "ponto",
  onUpdate: "NO ACTION",
  onDelete: "CASCADE",
  foreignKey: {
    name: "idPonto",
    allowNull: false,
    field: "id_ponto",
  },
});

export default RotaPonto;
