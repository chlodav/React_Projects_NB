import { useEffect, useMemo, useState } from 'react';
import './App.scss';

type Product = {
  id: number;
  name: string;
  price: number;
  fullPrice: number;
  screen: string;
  capacity: string;
  color: string;
  ram: string;
  year: number;
  image: string;
  category: string;
};

const categories = ['all', 'phones', 'tablets', 'accessories'] as const;

export const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<typeof categories[number]>('all');
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/products.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load product data');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setStatus('idle');
      })
      .catch(() => setStatus('error'));
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const normalizedName = product.name.toLowerCase();
        const normalizedQuery = query.trim().toLowerCase();
        const matchesQuery = normalizedName.includes(normalizedQuery);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesQuery && matchesCategory;
      }),
    [products, category, query],
  );

  return (
    <div className="App">
      <header className="topbar">
        <div className="brand">
          <div className="brand__mark" aria-hidden="true" />
          <span>Phone Catalog</span>
        </div>
        <nav className="topbar__nav" aria-label="Primary navigation">
          <a href="#products">Products</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero__copy">
            <p className="eyebrow">Fast, responsive phone catalog</p>
            <h1>Find the perfect device with an easy search and filter experience.</h1>
            <p className="hero__text">
              Browse optimized product previews, try the live search, and use the catalog filter for phones,
              tablets, and accessories.
            </p>
            <a className="button button--primary" href="#products">
              Explore products
            </a>
          </div>
          <div className="hero__visual">
            <div className="hero__card">
              <span className="hero__tag">Top seller</span>
              <h2>Apple iPhone 11</h2>
              <p>6.1&quot; display · 64GB · 4GB RAM</p>
            </div>
          </div>
        </section>

        <section className="products" id="products">
          <div className="section-header">
            <div>
              <p className="eyebrow">Product catalog</p>
              <h2>All available devices</h2>
            </div>
            <div className="product-filters">
              <label>
                Search
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by model or feature"
                />
              </label>
              <label>
                Category
                <select value={category} onChange={(event) => setCategory(event.target.value as typeof categories[number])}>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item === 'all' ? 'All categories' : item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {status === 'loading' && <p className="status-message">Loading products…</p>}
          {status === 'error' && <p className="status-message status-message--error">Unable to load products. Please refresh.</p>}
          {status === 'idle' && filteredProducts.length === 0 && (
            <p className="status-message">No products match this search. Try a different keyword or category.</p>
          )}

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-card__media">
                  <img
                    src={`/${product.image}`}
                    alt={product.name}
                    loading="lazy"
                    width="280"
                    height="280"
                  />
                </div>
                <div className="product-card__body">
                  <h3>{product.name}</h3>
                  <p className="product-card__meta">{product.screen} · {product.capacity} · {product.ram}</p>
                  <p className="product-card__price">
                    <span>${product.price}</span>
                    <small>${product.fullPrice}</small>
                  </p>
                  <div className="product-card__details">
                    <span>{product.year}</span>
                    <span>{product.color}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="feature-list" id="features">
          <div className="section-header">
            <div>
              <p className="eyebrow">Why this catalog</p>
              <h2>Optimized for performance and clarity</h2>
            </div>
          </div>
          <div className="feature-list__grid">
            <article>
              <h3>Fast loading</h3>
              <p>Images are served in modern WebP format and lazy-loaded to keep pages fast.</p>
            </article>
            <article>
              <h3>Smooth navigation</h3>
              <p>Anchor links and smooth scrolling make it easy to move through the layout.</p>
            </article>
            <article>
              <h3>Mobile friendly</h3>
              <p>The responsive layout adapts to small screens without horizontal overflow.</p>
            </article>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="section-header">
            <div>
              <p className="eyebrow">Get in touch</p>
              <h2>Questions? Send a quick note.</h2>
            </div>
          </div>
          <form className="contact-form" action="." method="GET">
            {/* Static deploys do not support POST workflows, so GET is used to demonstrate form behavior. */}
            <label>
              Name
              <input type="text" name="name" placeholder="Your name" required />
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="example@domain.com" required />
            </label>
            <label>
              Phone
              <input type="tel" name="phone" placeholder="+1 555 123 4567" />
            </label>
            <label>
              Message
              <textarea name="message" placeholder="Tell us what you are looking for" rows={4} />
            </label>
            <button className="button button--secondary" type="submit">
              Send message
            </button>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <p>Phone Catalog · Built with React and Vite.</p>
        <a href="#home">Back to top</a>
      </footer>
    </div>
  );
};
