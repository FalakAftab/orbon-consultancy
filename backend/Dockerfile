# --- Stage 1: install PHP dependencies -------------------------------------
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --ignore-platform-reqs

COPY . .
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# --- Stage 2: runtime image ---------------------------------------------------
FROM php:8.2-apache AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev \
        libzip-dev \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        libicu-dev \
        libonig-dev \
        unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo \
        pdo_pgsql \
        pgsql \
        zip \
        gd \
        intl \
        bcmath \
        mbstring \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*
# Note: the -dev packages above are intentionally kept installed. Purging
# them with --auto-remove also cascades into removing the runtime shared
# libraries (libpq.so.5, libicuio.so.76, libpng16.so.16, ...) that the
# compiled extensions (pdo_pgsql, intl, gd, zip) link against at runtime,
# which breaks every one of them silently until PHP tries to load them.

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Route every non-file request to Laravel's front controller directly at the
# vhost level, rather than relying on public/.htaccess + AllowOverride (the
# Debian default is AllowOverride None, which silently ignores .htaccess and
# 404s on every clean URL like /api/v1/...).
RUN { \
        echo '<Directory /var/www/html/public>'; \
        echo '    Options -Indexes +FollowSymLinks'; \
        echo '    AllowOverride All'; \
        echo '    Require all granted'; \
        echo ''; \
        echo '    RewriteEngine On'; \
        echo '    RewriteCond %{HTTP:Authorization} .'; \
        echo '    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]'; \
        echo '    RewriteCond %{REQUEST_FILENAME} !-d'; \
        echo '    RewriteCond %{REQUEST_FILENAME} !-f'; \
        echo '    RewriteRule ^ index.php [L]'; \
        echo '</Directory>'; \
    } > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

WORKDIR /var/www/html
COPY --from=vendor /app ./

RUN mkdir -p storage/framework/{cache,sessions,testing,views} storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80
ENTRYPOINT ["entrypoint.sh"]
CMD ["apache2-foreground"]
