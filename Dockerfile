FROM php:8.2-cli-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_MEMORY_LIMIT=-1

# System deps
RUN apt-get update && apt-get install -y \
    git curl unzip zip sqlite3 \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libicu-dev libzip-dev libxml2-dev libonig-dev \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        bcmath gd intl \
        pdo pdo_mysql pdo_sqlite \
        mbstring xml zip ctype fileinfo opcache

# Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP deps (layer cache: copy lockfiles first)
COPY composer.json composer.lock ./
RUN composer install --optimize-autoloader --no-dev --no-scripts --no-interaction

# Copy app
COPY . .

# Run post-install scripts now that full app is present
RUN composer run-script post-autoload-dump 2>/dev/null || true

# Build frontend
RUN npm ci --prefer-offline \
    && node --max-old-space-size=512 node_modules/.bin/vite build \
    && rm -rf node_modules

# Storage dirs
RUN mkdir -p \
        storage/framework/views \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/logs \
        bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

EXPOSE 8000

CMD ["/bin/sh", "-c", "\
    mkdir -p /tmp/laravel-views /tmp/uploads \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/logs \
    && touch /tmp/db.sqlite \
    && export DB_CONNECTION=sqlite \
           DB_DATABASE=/tmp/db.sqlite \
           VIEW_COMPILED_PATH=/tmp/laravel-views \
           CACHE_STORE=file \
           CACHE_PREFIX=jobly \
           COMPOSER_MEMORY_LIMIT=-1 \
    && php artisan optimize:clear \
    && php artisan storage:link --force 2>/dev/null || true \
    && php artisan migrate --force \
    && CATS=$(php artisan tinker --execute=\"echo \\\\App\\\\Models\\\\Category::count();\" 2>/dev/null | tr -d '[:space:]') \
    && if [ \"$CATS\" = \"0\" ] || [ -z \"$CATS\" ]; then php artisan db:seed --force; fi \
    && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]
