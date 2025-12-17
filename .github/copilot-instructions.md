# Copilot Instructions - Turma do Gatil

## Visão Geral

Este projeto é composto por um frontend Angular e um backend Spring Boot para gerenciamento de adoções de gatos.

---

## Frontend (turma-do-gatil-front)

### Componentes

- **Sempre utilize os componentes prontos** disponíveis em `src/app/shared/components/` antes de criar novos componentes
- Siga o padrão de arquitetura já estabelecido no projeto (pages, services, models, guards, interceptors)
- Verifique se já existe um componente que atenda sua necessidade antes de implementar algo novo

### Estilos

- **Evite sobrescrever estilos** em componentes já criados
- Centralize estilos reutilizáveis em `src/styles/` ou nos arquivos de estilo globais
- Não crie estilos inline ou específicos que dificultem a manutenção
- Utilize as variáveis CSS e temas já definidos no projeto

### Consumo de API

- **Sempre consulte o arquivo `api-definition.yaml`** localizado em `turma-do-gatil-back/` para identificar como consumir o backend
- Mantenha os models (`src/app/models/`) sincronizados com os DTOs do backend
- Utilize os services existentes em `src/app/services/` como referência para novos endpoints

### Boas Práticas

- Mantenha a consistência com o código existente
- Siga os padrões de nomenclatura já utilizados
- Reutilize código sempre que possível para evitar duplicação

---

## Backend (turma-do-gatil-back)

### Controllers

- **Sempre retorne DTOs** nos controllers, nunca entidades diretamente
- Mantenha os controllers enxutos, delegando lógica de negócio para os services

### Services

- **Service só chama Service**, nunca um Repository de outra entidade diretamente
- Se precisar de dados de outra entidade, injete e utilize o Service correspondente
- Mantenha a separação de responsabilidades entre as camadas

### Queries e Filtros

- **Filtros sempre em queries**, não no Java (sempre que possível)
- Evite buscar todos os registros e filtrar em memória
- Otimize as consultas para trazer apenas os dados necessários

### QueryDSL

- **Sempre utilize QueryDSL** para construção de queries dinâmicas
- Aproveite os recursos do QueryDSL para filtros, ordenação e paginação
- Mantenha as queries legíveis e bem estruturadas

### Migrations (Flyway)

- **Sempre escreva migrations** para alterações no banco de dados
- As migrations ficam em `src/main/resources/db/migration/`
- Siga o padrão de nomenclatura: `V{numero}__descricao.sql`
- Nunca altere migrations já aplicadas em produção

### API Definition

- **Sempre mantenha o `api-definition.yaml` atualizado** ao criar ou modificar endpoints
- O arquivo serve como documentação e contrato da API
- Atualize os schemas, paths e responses conforme necessário

### Boas Práticas

- Siga os padrões de código já estabelecidos no projeto
- Mantenha a consistência com as implementações existentes
- Documente endpoints complexos ou com regras de negócio específicas
