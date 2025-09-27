import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Corrida = sequelize.define(
  "corridas",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: {
      type: DataTypes.ENUM("ida", "volta"),
      allowNull: false,
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("em andamento", "finalizada"),
      allowNull: false,
      defaultValue: "em andamento",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Corrida;
