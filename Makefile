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
.PHONY: setup up down stop logs artisan composer npm test test-filter build dev cache-clear rebuild fresh optimize permissions restart help

# Target padrão - mostra a ajuda
.DEFAULT_GOAL := help

help: ## Mostra esta mensagem de ajuda
	@echo "════════════════════════════════════════════════════════════════"
	@echo "  Control Finance - Comandos Disponíveis"
	@echo "════════════════════════════════════════════════════════════════"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo "════════════════════════════════════════════════════════════════"
	@echo ""

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

## --------------------------------------
##  Build e Cache
## --------------------------------------

build: ## Reconstrói os assets do frontend (CSS/JS)
	@echo "Reconstruindo os assets do frontend..."
	$(COMPOSE_EXEC_NODE) npm run build

dev: ## Inicia o servidor de desenvolvimento do Vite
	@echo "Iniciando Vite em modo desenvolvimento..."
	$(COMPOSE_EXEC_NODE) npm run dev

cache-clear: ## Limpa todos os caches da aplicação
	@echo "Limpando cache de configuração..."
	$(ARTISAN) config:clear
	@echo "Limpando cache de rotas..."
	$(ARTISAN) route:clear
	@echo "Limpando cache de views..."
	$(ARTISAN) view:clear
	@echo "Limpando cache da aplicação..."
	$(ARTISAN) cache:clear
	@echo "✅ Todos os caches foram limpos!"

rebuild: cache-clear build ## Limpa cache e reconstrói os assets
	@echo "✅ Rebuild completo finalizado!"

fresh: ## Reseta o banco de dados e roda as migrations com seeders
	@echo "⚠️  ATENÇÃO: Isso irá apagar todos os dados do banco!"
	@echo "Resetando banco de dados..."
	$(ARTISAN) migrate:fresh --seed
	@echo "✅ Banco de dados resetado!"

optimize: ## Otimiza a aplicação para produção (cache de config, rotas e views)
	@echo "Otimizando aplicação..."
	$(ARTISAN) config:cache
	$(ARTISAN) route:cache
	$(ARTISAN) view:cache
	@echo "✅ Aplicação otimizada!"

permissions: ## Ajusta permissões das pastas storage e bootstrap/cache
	@echo "Ajustando permissões..."
	$(COMPOSE_EXEC_APP) chown -R www-data:www-data storage bootstrap/cache
	$(COMPOSE_EXEC_APP) chmod -R 775 storage bootstrap/cache
	@echo "✅ Permissões ajustadas!"

restart: down up ## Reinicia todos os containers
	@echo "✅ Containers reiniciados!"