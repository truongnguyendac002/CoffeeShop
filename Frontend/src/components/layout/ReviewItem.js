import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ReviewItem = ({ username, rating, date, comment , avatar}) => {
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex items-start p-4 border-b bg-white">
      <img src={avatar} alt="userAvatar" className="rounded-full md:w-14 md:h-14 w-10 h-10 mr-4 object-cover" />
      <div className="flex-1">
        <span className="font-semibold">{username}</span>
        <div className="flex md:mt-2 mt-1">{renderStars(rating)}</div>
        <div className="text-sm text-gray-500 md:mt-2 mt-1">{date}</div>
        <div className="lg:mt-3 mt-2">{comment}</div>
      </div>
    </div>
  );
};

export default ReviewItem;
