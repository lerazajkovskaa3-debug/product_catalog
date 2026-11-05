CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0)
);

INSERT INTO products (name, description, image, price)
VALUES (
    'Ноутбук',
    'Ноутбук для учёбы и работы',
    '/images/laptop.jpg',
    55000.00
);