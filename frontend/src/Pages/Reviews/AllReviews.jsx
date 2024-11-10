import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsAction } from "../../Redux/Actions/reviewsAction";
import Loader from "../../Components/Loader/Loader";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { RiEmotionHappyLine } from "react-icons/ri";
import Rating from "@mui/material/Rating"; // Updated import
import NotFoundCart from "../../Components/NotFoundCart/NotFoundCart";

const AllReviews = () => {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector(
    (state) => state.getAllReviews
  );

  useEffect(() => {
    document.title = `Customer Reviews`;
    dispatch(getAllReviewsAction());
  }, [dispatch]);

  return (
    <>
      <Header />
      {loading ? (
        <Loader LoadingName={"Getting Reviews"} />
      ) : error ? (
        "Error"
      ) : (
        <>
          <div className="all-reviews-container">
            <h1 className="Heading">
              Customer <span>Reviews</span>
            </h1>
            {reviews.length === 0 ? (
              <NotFoundCart msg={"No Reviews Yet"} />
            ) : (
              <div className="all-reviews-box">
                {reviews &&
                  reviews.map((review) => (
                    <div className="all-review-cart" key={review._id}>
                      <i>
                        <RiEmotionHappyLine />
                      </i>
                      <h5>
                        {review.user.firstName + " " + review.user.lastName}
                      </h5>
                      <p>{review.comment}</p>
                      <div className="all-reviews-stars">
                        <Rating defaultValue={review.ratings} readOnly />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default AllReviews;
