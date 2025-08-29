# 🚌 UniTrans API

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize" />
</div>

## 📋 Sobre o Projeto

**UniTrans** é um sistema completo de gerenciamento de transporte universitário que conecta **estudantes** e **empresas de transporte**. O sistema permite que alunos se vinculem a múltiplas empresas de transporte através de dois métodos: **tokens de acesso** (imediatos) ou **solicitações de vínculo** (com aprovação).

### 🎯 Funcionalidades Principais

- 🔐 **Autenticação completa** para alunos e empresas
- 🚌 **Gestão de veículos** com upload de imagens
- 🔗 **Sistema de vínculos** aluno-empresa (via token ou solicitação)
- 🛣️ **Gerenciamento de rotas** e pontos de parada
- 💳 **Integração com pagamentos** (Stripe)
- 📧 **Sistema de e-mail** para recuperação de senha

---

## 🛠️ **Tecnologias Utilizadas**

- **Backend:** Node.js + Express.js
- **Banco de Dados:** PostgreSQL + Sequelize ORM
- **Autenticação:** JWT + bcrypt
- **Upload de Arquivos:** express-fileupload
- **E-mail:** Nodemailer
- **Validação:** Joi/express-validator
- **Logs:** Morgan

---

## 📝 **Scripts Disponíveis**

```bash
npm run dev          # Executa servidor em modo desenvolvimento
npm start            # Executa servidor em produção
npm run test         # Executa testes (quando implementados)
```

---

<div align="center">
  <p>Desenvolvido para facilitar o transporte universitário</p>
</div>
