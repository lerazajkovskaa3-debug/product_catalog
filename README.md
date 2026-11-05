# Каталог компьютерной техники
Сайт на React + Vite, сервер на Node.js + Express, база данных PostgreSQL.
Можно добавлять и удалять товары, искать их по названию,
фильтровать по максимальной цене и сортировать по цене.

# Как запустить
Нужны Git и запущенный Docker с Docker Compose.

```bash
git clone https://github.com/lerazajkovskaa3-debug/product_catalog.git
cd product_catalog
docker compose up --build
```
Открыть http://localhost:5173.
В Cloud Shell — открыть предпросмотр на порту 5173.
При первом запуске таблица и начальные товары создаются из database/init.sql.

# Как это работает
React запрашивает товары через API. Vite передаёт запрос серверу Express,
а сервер получает данные из PostgreSQL и возвращает JSON.
Товары хранятся в базе, изображения — в frontend/public/images.
В базе записаны пути к картинкам.
# Проверка
Команды выполняются в отдельном терминале из папки проекта.
Посмотреть работающие контейнеры:
```bash
docker compose ps
```
Получить список товаров через API:
```bash
curl http://localhost:3000/api/products
```
Чтобы добавить товар прямо в базу:

```bash
docker compose exec db psql -U catalog_user -d catalog
```
Затем выполнить SQL:
```sql
INSERT INTO products (name, description, image, price)
VALUES ('Тестовый ноутбук', 'Проверка базы', '/images/laptop.jpg', 30000);
```
Выйти командой `\q`, очистить поиск и фильтр на сайте,
обновить страницу — новый товар появится в каталоге.
# Как остановить
```bash
docker compose down
```
Данные базы сохраняются в Docker-томе postgres_data.