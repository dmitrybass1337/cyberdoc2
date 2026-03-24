# Инструкция по деплою CyberDoc на cyberdoc.xyset.ru

## 1. Подготовка окружения

### 1.1 Переменные окружения
Создайте файл `.env.production` в корне проекта:

```env
VUE_APP_API_URL=https://belmix.ru
```

### 1.2 Сборка проекта
```bash
npm install
npm run build
```

Результат будет в папке `dist/`

---

## 2. Настройка сервера (Ubuntu/Debian)

### 2.1 Установка Nginx
```bash
sudo apt update
sudo apt install nginx
```

### 2.2 Конфигурация Nginx
Создайте файл `/etc/nginx/sites-available/cyberdoc`:

```nginx
server {
    listen 80;
    server_name cyberdoc.xyset.ru;
    
    root /var/www/cyberdoc/dist;
    index index.html;
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2.3 Активация конфигурации
```bash
sudo ln -s /etc/nginx/sites-available/cyberdoc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 3. SSL сертификат (Certbot)

### 3.1 Установка Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

### 3.2 Получение сертификата
```bash
sudo certbot --nginx -d cyberdoc.xyset.ru
```

### 3.3 Автообновление
```bash
sudo systemctl enable certbot.timer
```

---

## 4. DNS настройка

На панели управления доменом xyset.ru добавьте A-запись:

| Тип | Имя | Значение | TTL |
|-----|-----|----------|-----|
| A | cyberdoc | IP_ВАШЕГО_СЕРВЕРА | 3600 |

---

## 5. Деплой на сервер

### Вариант A: Прямое копирование (SCP)
```bash
npm run build
scp -r dist/* user@server:/var/www/cyberdoc/dist/
```

### Вариант B: Через Git
```bash
cd /var/www/cyberdoc
git pull origin main
npm install --production
npm run build
sudo systemctl restart nginx
```

---

## 6. Проверка

```bash
sudo systemctl status nginx
curl -I https://cyberdoc.xyset.ru
```

---

## Чек-лист деплоя

1. [ ] Создать `.env.production` с `VUE_APP_API_URL`
2. [ ] Выполнить `npm run build`
3. [ ] Настроить DNS A-запись
4. [ ] Установить Nginx на сервере
5. [ ] Загрузить `dist/` на сервер
6. [ ] Настроить конфиг Nginx
7. [ ] Получить SSL через Certbot
8. [ ] Проверить доступность сайта
