# Define o shell padrão
SHELL := /bin/bash

# Comandos Docker Compose
COMPOSE_UP = docker compose up --build -d
COMPOSE_DOWN = docker compose down
COMPOSE_EXEC_APP = docker compose exec app
COMPOSE_EXEC_NODE = docker compose exec node

# Comandos Artisan
ARTISAN = $(COMPOSE_EXEC_APP) php artisan

# Comandos Composer
COMPOSER = $(COMPOSE_EXEC_APP) composer

# Silencia a saída dos comandos
.SILENT:

# Define alvos que não são arquivos
.PHONY: setup up down stop logs artisan composer npm

## --------------------------------------
##  Setup Inicial
## --------------------------------------

setup: up ## Roda o setup completo do projeto pela primeira vez
	@echo "Instalando dependências do Composer..."
	$(COMPOSER) install
	@echo "Gerando a chave da aplicação..."
	$(ARTISAN) key:generate
	@echo "Rodando as migrações..."
	$(ARTISAN) migrate --seed
	@echo "🚀 Ambiente pronto em http://localhost:8080"

# Target auxiliar para garantir que o .env exista antes de subir os containers
up: .env ## Sobe os containers Docker
	@echo "Subindo os containers..."
	$(COMPOSE_UP)
	@echo "Aguardando containers..."
	@sleep 5
	@echo "Ajustando permissões da pasta storage e bootstrap/cache..."
	$(COMPOSE_EXEC_APP) chown -R www-data:www-data storage bootstrap/cache

.env:
	@if [ ! -f .env ]; then \
		echo "Copiando .env.example para .env..."; \
		cp .env.example .env; \
	fi

## --------------------------------------
##  Gerenciamento do Ambiente
## --------------------------------------

down: ## Para e remove os containers
	@echo "Parando os containers..."
	$(COMPOSE_DOWN)

stop: ## Apenas para os containers, sem remover
	@echo "Parando os containers..."
	docker compose stop

logs: ## Mostra os logs de um container específico (ex: make logs service=app)
	@echo "Mostrando logs para o serviço: $(service)..."
	docker compose logs -f $(service)

## --------------------------------------
##  Comandos da Aplicação
## --------------------------------------

artisan: ## Executa um comando Artisan (ex: make artisan cmd="cache:clear")
	@echo "Executando: php artisan $(cmd)..."
	$(ARTISAN) $(cmd)

composer: ## Executa um comando Composer (ex: make composer cmd="require laravel/breeze")
	@echo "Executando: composer $(cmd)..."
	$(COMPOSER) $(cmd)

npm: ## Executa um comando NPM no container node (ex: make npm cmd="install --save-dev prettier")
	@echo "Executando: npm $(cmd)..."
	$(COMPOSE_EXEC_NODE) npm $(cmd)

test: ## Executa os testes da aplicação
	@echo "Executando os testes..."
	$(ARTISAN) test

test-filter: ## Executa testes filtrados (ex: make test-filter filter="FixedTransactionTest")
	@echo "Executando testes com filtro: $(filter)..."
	$(ARTISAN) test --filter $(filter)