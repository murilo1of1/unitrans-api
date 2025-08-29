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

## 🚀 Estado do Desenvolvimento

### ✅ **Concluído**
- [x] Autenticação de usuários (JWT)
- [x] CRUD completo de empresas, alunos e veículos
- [x] Sistema de vínculos aluno-empresa
- [x] Upload de arquivos com servir estático
- [x] Recuperação de senha por e-mail
- [x] Modelos de dados relacionais completos

### 🔄 **Em Desenvolvimento**
- [ ] Interface frontend para alunos
- [ ] Painel administrativo para empresas
- [ ] Sistema de corridas e tracking
- [ ] Notificações em tempo real

### 📅 **Próximas Etapas**
- [ ] Implementação de pagamentos
- [ ] Sistema de avaliações
- [ ] Relatórios e analytics
- [ ] App mobile

---

## 🔧 Configuração e Instalação

### 📋 **Pré-requisitos**
- Node.js (v16+)
- PostgreSQL
- npm ou yarn

### ⚙️ **Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto:

```env
API_PORT=3333
POSTGRES_DB=unitrans_db
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

JWT_SECRET=seu_jwt_secret_aqui
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
```

### 🚀 **Instalação**

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd unitrans-api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# O sistema criará automaticamente as tabelas na primeira execução
```

4. **Execute o servidor**
```bash
npm run dev
```

5. **Acesse a API**
```
http://localhost:3000
```

---

## 📚 Documentação da API

### 🔐 **Autenticação**
```http
POST /empresa/login
POST /aluno/login
POST /empresa/forgot-password
POST /aluno/forgot-password
```

### 🏢 **Empresas**
```http
GET    /empresa          # Listar empresas (filtradas para solicitações)
GET    /empresa/:id      # Buscar empresa específica
POST   /empresa          # Criar empresa
PATCH  /empresa/:id      # Atualizar empresa
DELETE /empresa/:id      # Deletar empresa
```

### 👨‍🎓 **Alunos**
```http
GET    /aluno            # Listar alunos
GET    /aluno/:id        # Buscar aluno específico
POST   /aluno            # Criar aluno
PATCH  /aluno/:id        # Atualizar aluno
DELETE /aluno/:id        # Deletar aluno
```

### 🚌 **Veículos**
```http
GET    /veiculo          # Listar veículos
GET    /veiculo/:id      # Buscar veículo específico
POST   /veiculo          # Criar veículo (com upload de imagem)
PATCH  /veiculo/:id      # Atualizar veículo
DELETE /veiculo/:id      # Deletar veículo
```

### 🔗 **Sistema de Vínculos**

#### **Vínculos**
```http
GET    /vinculo/aluno/:idAluno          # Vínculos do aluno
GET    /vinculo/empresa/:idEmpresa      # Vínculos da empresa
PATCH  /vinculo/:id/desativar           # Desativar vínculo
PATCH  /vinculo/:id/reativar            # Reativar vínculo
```

#### **Tokens de Acesso**
```http
POST   /vinculo/token                           # Gerar token (empresa)
GET    /vinculo/token/empresa/:idEmpresa        # Listar tokens da empresa
PATCH  /vinculo/token/:id/revogar               # Revogar token
POST   /vinculo/usar-token                      # Usar token (aluno)
```

#### **Solicitações de Vínculo**
```http
POST   /vinculo/solicitacao                           # Solicitar vínculo (aluno)
GET    /vinculo/solicitacao/empresa/:idEmpresa        # Solicitações da empresa
GET    /vinculo/solicitacao/aluno/:idAluno            # Solicitações do aluno
PATCH  /vinculo/solicitacao/:id/aprovar               # Aprovar solicitação
PATCH  /vinculo/solicitacao/:id/rejeitar              # Rejeitar solicitação
```

---

## 🗄️ **Estrutura do Banco de Dados**

### **Principais Tabelas**
- `empresas` - Dados das empresas de transporte
- `alunos` - Dados dos estudantes
- `veiculos` - Frota das empresas
- `empresa_aluno` - Vínculos entre alunos e empresas
- `token_acesso` - Tokens para vínculos imediatos
- `solicitacao_vinculo` - Solicitações de vínculo pendentes

### **Relacionamentos**
- Empresa → Veículos (1:N)
- Empresa ↔ Alunos (N:M via empresa_aluno)
- Empresa → Tokens (1:N)
- Empresa → Solicitações (1:N)

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

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 **Licença**

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

<div align="center">
  <p>Desenvolvido com ❤️ para facilitar o transporte universitário</p>
</div>
