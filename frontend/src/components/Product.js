// should pass in a prop that displays info about product
// - image name price description
// Image and name to link to Product Page
// Create a Rating for 5 stars
// Button to add to cart
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function Product(props) {
  const { product } = props;

  return (
    <Card className="product">
      <Link to={`/product/${product.slug}`}>
        <img className="card-img-top" src={product.image} alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>{product.price}</Card.Text>
        <Card.Text>{product.description}</Card.Text>
      </Card.Body>
      <Button>Add to Cart</Button>
    </Card>
  );
}

export default Product;
