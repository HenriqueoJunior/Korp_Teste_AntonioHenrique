# 🧾 Sistema de Emissão de Notas Fiscais

Projeto técnico desenvolvido para o processo seletivo da **Korp Sistemas**.

Sistema completo de emissão de notas fiscais com arquitetura de microsserviços, frontend em Angular e backend em C# com ASP.NET Core.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Detalhamento Técnico](#detalhamento-técnico)

---

## Visão Geral

Aplicação para gerenciamento de produtos e emissão de notas fiscais, composta por:

- **Frontend** — Angular 21 com Angular Material
- **Estoque.API** — Microsserviço de controle de produtos e saldos
- **Faturamento.API** — Microsserviço de gestão de notas fiscais

---

## Tecnologias

### Frontend
| Tecnologia | Versão |
|------------|--------|
| Angular | 21 |
| Angular Material | 21 |
| TypeScript | 5+ |
| RxJS | 7+ |
| Node.js | 24 |

### Backend
| Tecnologia | Versão |
|------------|--------|
| .NET | 10 |
| ASP.NET Core Web API | 10 |
| Entity Framework Core | 9+ |
| SQLite | — |

---

## Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                   Frontend Angular                   │
│                  localhost:4200                      │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP
          ┌────────────┴────────────┐
          │                         │
┌─────────▼──────────┐   ┌─────────▼──────────┐
│   Estoque.API       │   │  Faturamento.API    │
│  localhost:5001     │◄──│  localhost:5002     │
│                     │   │                     │
│  [ estoque.db ]     │   │  [ faturamento.db ] │
└─────────────────────┘   └─────────────────────┘
```

Os dois microsserviços são independentes, cada um com seu próprio banco de dados SQLite. O `Faturamento.API` se comunica com o `Estoque.API` via HTTP para atualizar o saldo dos produtos ao imprimir uma nota fiscal.

---

## Funcionalidades

### Cadastro de Produtos
- Listar, criar, editar e excluir produtos
- Campos: código, descrição e saldo em estoque

### Cadastro de Notas Fiscais
- Criar notas com múltiplos produtos e quantidades
- Numeração sequencial automática
- Status inicial: **Aberta**

### Impressão de Notas Fiscais
- Botão de impressão visível na tela de detalhe
- Indicador de processamento durante a operação
- Ao imprimir: status muda para **Fechada** e saldo dos produtos é deduzido automaticamente
- Notas fechadas não podem ser reimpressas

### Filtro de Notas
- Filtrar por status: Todas / Abertas / Fechadas

### Tratamento de Falhas
- **Saldo insuficiente** — mensagem clara ao tentar imprimir sem estoque
- **Serviço indisponível** — quando o `Estoque.API` está fora do ar, o sistema informa o usuário e mantém a nota em aberto sem corromper dados

---

## Como Executar

### Pré-requisitos

- [Node.js 24+](https://nodejs.org/)
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Angular CLI](https://angular.dev/tools/cli)

```bash
npm install -g @angular/cli
```

### 1. Backend — Estoque.API

```bash
cd Estoque.API
dotnet run
# Rodando em http://localhost:5001
```

### 2. Backend — Faturamento.API

```bash
cd Faturamento.API
dotnet run
# Rodando em http://localhost:5002
```

> Os bancos de dados SQLite (`estoque.db` e `faturamento.db`) são criados automaticamente na primeira execução.

### 3. Frontend — Angular

```bash
cd NotasFiscais
npm install
ng serve
# Acesse http://localhost:4200
```

> **Atenção:** Os dois serviços de backend precisam estar rodando antes de usar o frontend.

---

## Estrutura do Projeto

```
Korp_Teste_AntonioHenrique/
│
├── NotasFiscais/                  # Frontend Angular
│   └── src/app/
│       ├── models/                # Interfaces TypeScript
│       ├── services/              # Services com RxJS
│       └── pages/
│           ├── produtos/          # Telas de produto
│           └── notas-fiscais/     # Telas de nota fiscal
│
├── Estoque.API/                   # Microsserviço de estoque
│   ├── Controllers/
│   ├── Models/
│   ├── DTOs/
│   ├── Data/
│   └── Services/
│
└── Faturamento.API/               # Microsserviço de faturamento
    ├── Controllers/
    ├── Models/
    ├── DTOs/
    ├── Data/
    └── Services/
```

---

## Detalhamento Técnico

### Ciclos de Vida do Angular
O `ngOnInit` foi utilizado em todos os componentes para disparar o carregamento de dados da API no momento ideal do ciclo de vida, após a injeção de dependências estar pronta.

### RxJS
- **`Observable`** — todos os métodos dos services retornam Observables
- **`catchError` + `throwError`** — tratamento de erros em todos os services
- **`Subject` + `startWith` + `switchMap`** — filtro reativo de notas fiscais; o `switchMap` cancela requisições anteriores automaticamente ao trocar o filtro, evitando respostas fora de ordem

### Angular Material
Biblioteca de componentes visuais utilizada: `MatTable`, `MatSidenav`, `MatSnackBar`, `MatProgressSpinner`, `MatChip`, `MatButtonToggleGroup`, `MatFormField`, `MatSelect`, `MatIcon`.

### ASP.NET Core Web API
Roteamento por atributos, injeção de dependência nativa, `IHttpClientFactory` para comunicação entre microsserviços, serialização JSON com `ReferenceHandler.IgnoreCycles` e `JsonStringEnumConverter`.

### Tratamento de Erros no Backend
Padrão de retorno com **tupla** `(NotaFiscal? nota, string? erro)` no `NotaFiscalService`. O método `ImprimirAsync` usa `try/catch` na comunicação com o `Estoque.API`, retornando mensagens descritivas em caso de falha. Controllers retornam `200 OK`, `400 BadRequest` ou `404 NotFound` conforme o resultado.

### LINQ
Utilizado extensivamente com `Include`, `Where`, `OrderByDescending`, `Select`, `MaxAsync`, `ToListAsync` e `FirstOrDefaultAsync` para consultas expressivas e assíncronas ao banco de dados.

---

## Autor

**Antonio Henrique**  
Teste Técnico — Korp Sistemas — Abril / 2026
