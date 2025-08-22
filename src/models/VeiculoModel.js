import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Empresa from "./EmpresaModel.js";
import Rota from "./RotaModel.js";

const Veiculo = sequelize.define(
  "veiculos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    placa: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imagem: {
      type: DataTypes.STRING,
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

Veiculo.belongsTo(Empresa, {
  as: "empresa",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idEmpresa",
    allowNull: false,
    field: "id_empresa",
  },
});

Veiculo.belongsTo(Rota, {
  as: "rota",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idRota",
    allowNull: true,
    field: "id_rota",
  },
});

export default Veiculo;
