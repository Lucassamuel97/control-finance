
# Samuca Control Finance

A ferramenta definitiva para organizar suas finanças pessoais. Com o **Samuca Control Finance**, você tem o controle total sobre suas receitas e despesas de forma simples e intuitiva.

A aplicação foi desenvolvida com **Laravel 10**, **React** e **Inertia.js**. O ambiente de desenvolvimento é totalmente containerizado com **Docker** e gerenciado via **Makefile** para uma experiência de setup simplificada.

## Funcionalidades Principais

- ✅ **Controle de Gastos:** Crie categorias para suas despesas e receitas, sabendo exatamente para onde seu dinheiro está indo.
- 📊 **Visualize seu Saldo:** Veja o resumo das suas entradas, saídas e o saldo atual diretamente no seu dashboard.

## Índice

- [Requisitos](#requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Comandos Úteis](#comandos-úteis)
- [Estrutura dos Serviços Docker](#estrutura-dos-serviços-docker)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

## Requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados na sua máquina:

- **Docker Engine:** [Link para instalação](https://docs.docker.com/engine/install/)
- **Docker Compose V2:** Geralmente já vem com o Docker Desktop ou pode ser instalado como plugin do CLI.
- **make:**
    - Linux/macOS: Geralmente já vem instalado.
    - Windows: Recomendado o uso do WSL2 (Windows Subsystem for Linux) ou através do Git Bash.
- **Git:** Essencial para clonar o repositório.

## Instalação e Execução

Para subir a aplicação pela primeira vez, siga os passos abaixo. Graças ao Makefile, o processo é muito simples.

1. **Clone o repositório:**

     ```bash
     git clone https://github.com/Lucassamuel97/control-finance
     ```

2. **Navegue até o diretório do projeto:**

     ```bash
     cd control-finance
     ```

3. **Execute o comando de setup inicial:**

     ```bash
     make setup
     ```

     Este comando é executado apenas na primeira vez. Ele irá automaticamente:

     - Copiar o arquivo `.env.example` para `.env`.
     - Construir e subir todos os containers Docker.
     - Ajustar as permissões das pastas `storage` e `bootstrap/cache`.
     - Instalar as dependências do Composer (`composer install`).
     - Gerar a chave da aplicação Laravel (`php artisan key:generate`).
     - Rodar as migrações e seeds do banco de dados (`php artisan migrate --seed`).

4. **Acesse a aplicação:**

     - 🌐 Aplicação Web: [http://localhost:8080](http://localhost:8080)
     - ⚡️ Servidor Vite HMR: A porta 5173 estará ativa para o Hot Module Replacement.

Para iniciar o trabalho nos dias seguintes, você só precisa usar o comando:

```bash
make up
```

## Comandos Úteis

Todas as operações comuns do dia a dia podem ser executadas através de comandos `make` simples.

| Comando                              | Descrição                                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------- |
| `make setup`                         | Executa o setup completo do projeto. Use apenas na primeira vez.                            |
| `make up`                            | Sobe os containers. Use para iniciar o trabalho no dia a dia.                               |
| `make down`                          | Para e remove os containers.                                                                |
| `make stop`                          | Apenas para os containers, sem removê-los.                                                  |
| `make logs service=<nome>`           | Mostra os logs de um serviço específico. Ex: `make logs service=app`.                       |
| `make artisan cmd="<comando>"`       | Executa um comando Artisan no container app. Ex: `make artisan cmd="cache:clear"`.          |
| `make composer cmd="<comando>"`      | Executa um comando Composer no container app. Ex: `make composer cmd="require laravel/breeze"`. |
| `make npm cmd="<comando>"`           | Executa um comando NPM no container node. Ex: `make npm cmd="install --save-dev prettier"`. |

## Estrutura dos Serviços Docker

O ambiente é composto pelos seguintes serviços, definidos no `docker-compose.yml`:

- **app:** O container principal com PHP 8.2-FPM que executa a aplicação Laravel.
- **nginx:** Servidor web Alpine Nginx que atua como proxy reverso para o serviço app. É o ponto de entrada da aplicação.
- **mysql:** Banco de dados MySQL 8.0. Os dados são persistidos em um volume Docker para não serem perdidos.
- **node:** Container com Node.js 20 que executa o servidor de desenvolvimento do Vite para compilação de assets e Hot Module Replacement (HMR).

## Tecnologias Utilizadas

- **Backend:** Laravel 10
- **Frontend:** React, Inertia.js, Vite
- **Banco de Dados:** MySQL 8
- **Ambiente:** Docker, Docker Compose
