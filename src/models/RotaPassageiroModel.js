import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Rota from "./RotaModel.js";
import Aluno from "./AlunoModel.js";
import Ponto from "./PontoModel.js";

const RotaPassageiro = sequelize.define(
  "rota_passageiros",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idRota: {
      field: "id_rota",
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rotas",
        key: "id",
      },
    },
    idAluno: {
      field: "id_aluno",
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "alunos",
        key: "id",
      },
    },
    pontoEmbarque: {
      field: "ponto_embarque",
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pontos",
        key: "id",
      },
    },
    pontoDesembarque: {
      field: "ponto_desembarque",
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pontos",
        key: "id",
      },
    },
    dataEscolha: {
      field: "data_escolha",
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["id_rota", "id_aluno", "data_escolha"],
        name: "unique_rota_aluno_data",
      },
    ],
  }
);

// Associações
RotaPassageiro.belongsTo(Rota, {
  as: "rota",
  foreignKey: "idRota",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

RotaPassageiro.belongsTo(Aluno, {
  as: "aluno",
  foreignKey: "idAluno",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

RotaPassageiro.belongsTo(Ponto, {
  as: "pontoEmbarqueObj",
  foreignKey: "pontoEmbarque",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

RotaPassageiro.belongsTo(Ponto, {
  as: "pontoDesembarqueObj",
  foreignKey: "pontoDesembarque",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

export default RotaPassageiro;
