
# 🧪 Testes End-to-End com Cypress — Kanban App

Este repositório contém testes automatizados com [Cypress](https://www.cypress.io/) para validar funcionalidades principais do aplicativo **Kanban**, disponível em:

🔗 [https://kanban-dusky-five.vercel.app](https://kanban-dusky-five.vercel.app)

---

## 📂 Estrutura do Projeto

```
.
├── cypress/
│   ├── e2e/
│   │   └── kanban.cy.js          # Casos de teste E2E
│   ├── fixtures/                 # Dados mockados
│   └── support/                  # Configurações e comandos globais
├── cypress.config.js            # Configuração do Cypress
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## ✅ Funcionalidades testadas

### 🔹 Criação de Lista (Coluna)
Verifica se o usuário consegue adicionar uma nova lista ao board Kanban.

### 🔹 Inspeção de Elementos (DEBUG)
Executa inspeções manuais com `console.log` da estrutura HTML após criação de listas, captura elementos clicáveis e elementos próximos.

### 🔹 Adição de Tarefa (Exploratória)
Tenta diversas abordagens para localizar o botão/ícone correto para adicionar tarefas dentro de uma lista, simulando interação real do usuário com diferentes seletores possíveis.

---

## 🛠️ Como executar os testes

### 1. Clone o projeto

```bash
git clone https://github.com/felinux0x/kanban.git
cd kanban
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute o Cypress

#### Interface Gráfica (modo interativo)

```bash
npx cypress open
```

#### Linha de comando (modo headless)

```bash
npx cypress run
```

---

## ⚙️ Requisitos

- Node.js 18 ou superior
- npm 9+ ou yarn
- Cypress 13+

---

## ⚠️ Observações

- Os testes rodam diretamente contra a aplicação em produção no Vercel.
- A pasta `node_modules/` é ignorada via `.gitignore`.
- O projeto está configurado com quebra de linha `CRLF` (padrão Windows), podendo gerar avisos do Git ao trabalhar em ambientes Unix-like.

---

## 👤 Autor

**Felipe da Silva Rosa**  
🔐 Profissional de Segurança Ofensiva / QA técnico  
📎 GitHub: [felinux0x](https://github.com/felinux0x)

---

## 📄 Licença

Este projeto está licenciado sob os termos da licença MIT.
