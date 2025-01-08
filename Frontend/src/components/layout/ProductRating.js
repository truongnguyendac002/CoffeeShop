import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const ProductRating = ({ product }) => {
  if (!product || typeof product.rating !== 'number') {
    return <div>Product rating is unavailable</div>;
  }

  const fullStars = Math.floor(product.rating);
  const partOfStar = (product.rating - fullStars) * 100;

  return (
    <div className="flex items-center">
      <span className="mr-2 text-gray-700">{product.rating.toFixed(1)}</span>
      <div className="flex text-yellow-500">
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={index} />
        ))}
        {partOfStar > 0 && (
          <div className="relative">
            <FaRegStar />
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: `${partOfStar}%` }}
            >
              <FaStar className="text-yellow-500 absolute top-0 left-0" style={{ clipPath: 'inset(0 0 0 0)' }} />
            </div>
          </div>
        )}
        {[...Array(5 - fullStars - (partOfStar > 0 ? 1 : 0))].map((_, index) => (
          <FaRegStar key={index} />
        ))}
      </div>
      <span className="ml-2 text-gray-700">({product.totalReview} reviews)</span>
    </div>
  );
};

export default ProductRating;
