import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Empresa from "./EmpresaModel.js";

const Rota = sequelize.define(
  "rotas",
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
    inicio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destino: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
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

Rota.belongsTo(Empresa, {
  as: "empresa",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idEmpresa",
    allowNull: false,
    field: "id_empresa",
  },
});

export default Rota;
