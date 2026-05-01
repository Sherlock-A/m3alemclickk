FROM dunglas/frankenphp:php8.2-bookworm

ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_MEMORY_LIMIT=-1
ENV DEBIAN_FRONTEND=noninteractive

# System deps
RUN apt-get update && apt-get install -y \
    git curl unzip zip sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions via install-php-extensions (included in FrankenPHP image)
RUN install-php-extensions \
    bcmath gd intl \
    pdo pdo_mysql pdo_sqlite pdo_pgsql \
    mbstring xml zip ctype fileinfo \
    opcache redis

# PHP production settings
COPY docker/php.ini /usr/local/etc/php/conf.d/app.ini

# Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# PHP deps — separate layer for caching
COPY composer.json composer.lock ./
RUN composer install --optimize-autoloader --no-dev --no-scripts --no-interaction

# Application code
COPY . .
RUN composer run-script post-autoload-dump 2>/dev/null || true

# Frontend build
RUN npm ci --prefer-offline \
    && node --max-old-space-size=512 node_modules/.bin/vite build \
    && rm -rf node_modules

# Storage dirs & permissions
RUN mkdir -p \
        storage/framework/views \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/logs \
        bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

# Server config
COPY docker/Caddyfile /etc/caddy/Caddyfile

# Startup script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000

CMD ["/start.sh"]
