# M3allemClick Laravel

## Démarrage

```bash
cp .env.example .env
docker-compose up -d
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
npm install
php artisan storage:link
composer run dev
```

## Login démo

### Admin
```bash
curl -X POST http://127.0.0.1:8000/api/auth/mock-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@m3allemclick.ma","role":"admin"}'
```

### Pro
```bash
curl -X POST http://127.0.0.1:8000/api/auth/mock-login \
  -H "Content-Type: application/json" \
  -d '{"email":"pro1@m3allemclick.ma","role":"professional"}'
```

Place ensuite le `token` retourné dans `localStorage.setItem('m3allemclick_token', '...')`.
