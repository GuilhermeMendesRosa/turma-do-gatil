# 🐱 Turma do Gatil

Sistema completo de gerenciamento para organizações de adoção de gatos, desenvolvido com Spring Boot e Angular.

## 📋 Sobre o Projeto

O **Turma do Gatil** é uma aplicação web fullstack desenvolvida para facilitar o gerenciamento de gatos em organizações de adoção. O sistema permite o controle completo do processo de adoção, desde o cadastro dos gatos até o acompanhamento pós-adoção.

### ✨ Funcionalidades Principais

- 🐾 **Gestão de Gatos**: Cadastro, edição e visualização de gatos disponíveis para adoção
- 👥 **Gestão de Adotantes**: Controle completo de pessoas interessadas em adoção
- 📝 **Processo de Adoção**: Acompanhamento do status das adoções (pendente, completa, cancelada)
- ⚕️ **Controle de Castrações**: Gerenciamento de procedimentos de castração
- 📋 **Notas e Observações**: Sistema de anotações para cada gato
- 📊 **Dashboard**: Visão geral com métricas importantes

## 🏗️ Arquitetura

O projeto está organizado em duas aplicações principais:

```
turma-do-gatil/
├── turma-do-gatil-back/    # API REST (Spring Boot)
└── turma-do-gatil-front/   # Interface Web (Angular)
```

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.5
- **Java**: 17
- **Banco de Dados**: PostgreSQL (configurável)
- **Documentação**: OpenAPI 3.0 (Swagger)
- **Arquitetura**: RESTful API com padrão MVC

### Frontend (Angular)
- **Framework**: Angular 20.2.1
- **UI Framework**: PrimeNG
- **Estilo**: CSS customizado
- **SSR**: Suporte a Server-Side Rendering

## 🚀 Pré-requisitos

- **Java 17** ou superior
- **Node.js 18** ou superior
- **npm** ou **yarn**
- **PostgreSQL** (ou outro banco configurado)
- **Maven 3.6** ou superior

## ⚙️ Configuração e Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/GuilhermeMendesRosa/turma-do-gatil.git
cd turma-do-gatil
```

### 2. Configuração do Backend

```bash
cd turma-do-gatil-back

# Configure o banco de dados no arquivo application.properties
# Edite src/main/resources/application.properties com suas credenciais

# Execute a aplicação
./mvnw spring-boot:run
```

A API estará disponível em: `http://localhost:8080`

### 3. Configuração do Frontend

```bash
cd turma-do-gatil-front

# Instale as dependências
npm install

# Execute a aplicação
npm start
```

A aplicação web estará disponível em: `http://localhost:4200`

### 4. Configuração do Banco de Dados

O projeto inclui um arquivo `database-dump.sql` com dados de exemplo:

```bash
# Execute o script SQL no seu banco PostgreSQL
psql -U seu_usuario -d turma_do_gatil < turma-do-gatil-back/database-dump.sql
```

## 📡 API Endpoints

### Gatos
- `GET /api/cats` - Listar gatos
- `POST /api/cats` - Criar novo gato
- `GET /api/cats/{id}` - Buscar gato por ID
- `PUT /api/cats/{id}` - Atualizar gato
- `DELETE /api/cats/{id}` - Remover gato

### Adotantes
- `GET /api/adopters` - Listar adotantes
- `POST /api/adopters` - Criar novo adotante
- `GET /api/adopters/{id}` - Buscar adotante por ID
- `PUT /api/adopters/{id}` - Atualizar adotante
- `DELETE /api/adopters/{id}` - Remover adotante

### Adoções
- `GET /api/adoptions` - Listar adoções
- `POST /api/adoptions` - Criar nova adoção
- `GET /api/adoptions/{id}` - Buscar adoção por ID
- `PUT /api/adoptions/{id}` - Atualizar status da adoção
- `DELETE /api/adoptions/{id}` - Cancelar adoção

### Castrações
- `GET /api/sterilizations` - Listar castrações
- `POST /api/sterilizations` - Agendar castração
- `PUT /api/sterilizations/{id}` - Atualizar castração

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger UI:
- **Desenvolvimento**: `http://localhost:8080/swagger-ui.html`
- **Especificação OpenAPI**: Disponível em `turma-do-gatil-back/api-definition.yaml`

## 🧪 Testes

### Backend
```bash
cd turma-do-gatil-back
./mvnw test
```

### Frontend
```bash
cd turma-do-gatil-front
npm test
```

## 🛠️ Ferramentas Úteis

### Postman Collection
O projeto inclui uma collection do Postman (`Turma_do_Gatil_API_Collection.postman_collection.json`) com todos os endpoints configurados.

### Scripts Maven
```bash
# Compilar o projeto
./mvnw compile

# Executar testes
./mvnw test

# Gerar JAR
./mvnw package
```

### Scripts NPM
```bash
# Desenvolvimento
npm start

# Build para produção
npm run build

# Testes
npm test

# Linting
npm run lint
```

## 🐳 Docker (Opcional)

```bash
# Backend
cd turma-do-gatil-back
docker build -t turma-gatil-api .
docker run -p 8080:8080 turma-gatil-api

# Frontend
cd turma-do-gatil-front
docker build -t turma-gatil-web .
docker run -p 4200:4200 turma-gatil-web
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: Equipe Turma do Gatil
- **Contato**: contato@turmadogatil.com

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a [documentação da API](turma-do-gatil-back/api-definition.yaml)
2. Consulte os [issues existentes](https://github.com/GuilhermeMendesRosa/turma-do-gatil/issues)
3. Crie um novo issue se necessário

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

**Desenvolvido com ❤️ para ajudar nossos amigos felinos a encontrarem um lar! 🏠🐱**