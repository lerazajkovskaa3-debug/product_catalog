import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [search, setSearch] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sort, setSort] = useState('');


    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await fetch('/api/products');

                if (!response.ok) {
                    throw new Error('Ошибка получения товаров');
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError(error.message);
            }
        }

        loadProducts();
    }, []);

    async function deleteProduct(id) {
    if (!window.confirm('Удалить этот товар?')) {
        return;
    }

    try {
        const response = await fetch('/api/products/' + id, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Не удалось удалить товар');
        }

        setProducts((currentProducts) =>
            currentProducts.filter((product) => product.id !== id)
        );

        setError('');
    } catch (error) {
        setError(error.message);
    }
    }

    async function addProduct(event) {
    event.preventDefault();

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: description,
                image: image,
                price: Number(price)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка добавления товара');
        }

        setProducts((currentProducts) => [...currentProducts, data]);

        setName('');
        setDescription('');
        setImage('');
        setPrice('');
        setError('');
    } catch (error) {
        setError(error.message);
    }
  }
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

    const matchesPrice =
        maxPrice === '' || Number(product.price) <= Number(maxPrice);

    return matchesSearch && matchesPrice;
  });
  if (sort === 'asc') {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  }
  if (sort === 'desc') {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }


    return (
        <main>
            <h1>Каталог компьютерной техники</h1>

            <form className="product-form" onSubmit={addProduct}>
              <h2>Добавить товар</h2>
              <label> Названиe
                <input type="text" value={name} onChange={(event) => setName(event.target.value)} maxLength={100} required/>
                </label>

              <label> Описание
                  <textarea value={description} onChange={(event) => setDescription(event.target.value)} required/>
              </label>

              <label> Путь к изображению
                <input type="text" value={image} onChange={(event) => setImage(event.target.value)} placeholder="/images/laptop2.jpg" required/>
              </label>

              <label> Цена
                <input type="number" value={price} onChange={(event) => setPrice(event.target.value)} min="0" step="0.01" required/>
              </label>
            
            <button type="submit">Добавить товар</button>
            </form>

            {error && <p>{error}</p>}

            <label> Поиск по названию
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Введите название товара"/>
            </label>

            <label> Максимальная цена
              <input type="number" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} min="0" step="0.01" placeholder="Без ограничения"/>
            </label>

            <label> Сортировка
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="">Без сортировки</option>
                <option value="asc">Сначала дешёвые</option>
                <option value="desc">Сначала дорогие</option>
              </select>
            </label>

            <div className="products">
                {filteredProducts.map((product) => (
                    <article className="product-card" key={product.id}>
                        <img src={product.image} alt={product.name} />
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Цена: {product.price} руб.</p>
                        <button onClick={() => deleteProduct(product.id)}>
                          Удалить
                        </button>
                    </article>
                ))}
            </div>
        </main>
    );
}

export default App;