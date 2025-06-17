FROM php:8.2-fpm

# Instala dependências do sistema e extensões do PHP
RUN apt-get update && apt-get install -y \
    unzip \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libzip-dev \
    zip \
    git \
    mariadb-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql mbstring zip exif

# Instala o Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www

# Otimização de cache: Copia apenas os arquivos de dependência primeiro
COPY composer.json composer.lock ./

# Instala as dependências do Composer. Se os arquivos .json/.lock não mudarem, o Docker usará o cache aqui.
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts --no-autoloader

# Agora sim, copia o restante do código da aplicação
COPY . .

# Gera o autoload novamente após copiar todos os arquivos
RUN composer dump-autoload --optimize

# Ajusta as permissões
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]