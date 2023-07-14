import { Link } from "react-router-dom";
import products from "../data/products";

function HomeScreen() {
  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products">
        {products.clothing.map((item) => (
          <div className="product" key={item.slug}>
            <Link to={`/product/${item.slug}`}>
              <img src={item.image} alt={item.name} />
            </Link>
            <div className="product-info">
              <Link to={`/product/${item.slug}`}>
                <p>{item.name}</p>
              </Link>
              <p>
                <strong>{item.price}</strong>
              </p>
              <p>{item.description}</p>
              <button>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeScreen;
