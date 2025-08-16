import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Corrida from "./CorridaModel.js";
import Aluno from "./AlunoModel.js";
import Ponto from "./PontoModel.js";

const PassageiroLog = sequelize.define(
  "passageiro_logs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    acao: {
      type: DataTypes.ENUM("embarque", "desembarque"),
      allowNull: false,
    },
    horario: {
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

PassageiroLog.belongsTo(Corrida, {
  as: "corrida",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idCorrida",
    allowNull: false,
    field: "id_corrida",
  },
});

PassageiroLog.belongsTo(Aluno, {
  as: "aluno",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idAluno",
    allowNull: false,
    field: "id_aluno",
  },
});

PassageiroLog.belongsTo(Ponto, {
  as: "ponto",
  onUpdate: "NO ACTION",
  onDelete: "NO ACTION",
  foreignKey: {
    name: "idPonto",
    allowNull: false,
    field: "id_ponto",
  },
});

export default PassageiroLog;
