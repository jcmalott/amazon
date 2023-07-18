import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";

// display rating from product
// display number of reviews
function Rating(props) {
  const { rating, numReviews } = props;

  return (
    <div className="rating">
      <span>
        <FontAwesomeIcon
          icon={rating >= 1 ? faStar : rating >= 0.5 ? faStarHalfStroke : ""}
        />
        <FontAwesomeIcon
          icon={rating >= 2 ? faStar : rating >= 1.5 ? faStarHalfStroke : ""}
        />
        <FontAwesomeIcon
          icon={rating >= 3 ? faStar : rating >= 2.5 ? faStarHalfStroke : ""}
        />
        <FontAwesomeIcon
          icon={rating >= 4 ? faStar : rating >= 3.5 ? faStarHalfStroke : ""}
        />
        <FontAwesomeIcon
          icon={rating >= 5 ? faStar : rating >= 4.5 ? faStarHalfStroke : ""}
        />
      </span>
      <span>{numReviews} reviews</span>
    </div>
  );
}

export default Rating;
