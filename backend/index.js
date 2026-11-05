const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

app.get('/api', (req, res) => {
    res.json({ message: 'Сервер работает' });
});
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM products ORDER BY id'
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ошибка получения товаров'
        });
    }
});

app.post('/api/products', async (req, res) => {
    const { name, description, image, price } = req.body;

    if (
        typeof name !== 'string' || !name.trim() ||
        typeof description !== 'string' || !description.trim() ||
        typeof image !== 'string' || !image.trim() ||
        typeof price !== 'number' ||
        !Number.isFinite(price) || price < 0
    ) {
        return res.status(400).json({
            message: 'Заполните все поля и укажите неотрицательную цену'
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO products (name, description, image, price)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name.trim(), description.trim(), image.trim(), price]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ошибка добавления товара'
        });
    }
});
app.delete('/api/products/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Некорректный номер товара'
        });
    }

    try {
        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Товар не найден'
            });
        }

        res.json({ message: 'Товар удалён' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ошибка удаления товара'
        });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Сервер запущен на порту 3000');
});