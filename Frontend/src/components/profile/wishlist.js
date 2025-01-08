import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Pagination, Typography, message } from "antd";
import { removeFromFavorites } from "../../store/favoritesSlice ";
import fetchWithAuth from "../../helps/fetchWithAuth";
import summaryApi from "../../common";
import image1 from "../../assets/img/empty.jpg";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const favorites = useSelector((state) => state.favorites.items);
  const user = useSelector((store) => store?.user?.user);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(2);

  const currentFavorites = useMemo(() => {
    const indexOfLastFavorite = currentPage * pageSize;
    const indexOfFirstFavorite = indexOfLastFavorite - pageSize;
    return favorites.slice(indexOfFirstFavorite, indexOfLastFavorite);
  }, [currentPage, pageSize, favorites]);


  const handleRemoveFavorite = async (product) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(summaryApi.deleteFavorites.url, {
        method: summaryApi.deleteFavorites.method,
        body: JSON.stringify({
          UserId: user.id,
          ProductId: product.id,
        }),
      });

      const data = await response.json();
      if (data.respCode === "000") {

        const updateFavorites = favorites.filter((item) =>  item.id !== product.id);
        const totalPages =  Math.ceil(updateFavorites.length / pageSize);

        if(currentPage > totalPages) {
          setCurrentPage(Math.max(1 , totalPages ));
        }
        dispatch(removeFromFavorites(product));
        message.success("Sản phẩm đã được xóa khỏi danh sách yêu thích");
      } else {
        throw new Error("Lỗi khi xóa sản phẩm khỏi danh sách yêu thích");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi danh sách yêu thích:", error);
      message.error("Không thể xóa sản phẩm khỏi danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  const handleViewItem = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <Title level={3} className="text-lg sm:text-xl font-semibold">
        Wish List
      </Title>
      <div className="mt-4 space-y-4">
        {favorites.length === 0 ? (
          <Text className="text-gray-500 text-center">
            Danh sách yêu thích trống.
          </Text>
        ) : (
          currentFavorites.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div
                className="flex items-center w-full sm:w-auto cursor-pointer"
                onClick={() => handleViewItem(item)}
              >
                <img
                  className="w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-lg object-cover"
                  src={item.images[0]?.url ? item.images[0].url : image1}
                  alt={item.name}
                />
                <div className="ml-4 flex-1">
                  <Text className="block mb-1 font-medium text-base sm:text-lg text-gray-800">
                    {item.name}
                  </Text>
                  <Text className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium text-gray-700">
                      Category:{" "}
                    </span>
                    {item.category.name}
                  </Text>
                </div>
              </div>
              <Button
                className="mt-3 sm:mt-0 sm:ml-4 w-full sm:w-auto"
                type="primary"
                danger
                loading={loading === item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(item);
                }}
              >
                Remove
              </Button>
            </div>
          ))
        )}

        {
          favorites.length > pageSize  && (
          <Pagination 
            current={currentPage} 
            pageSize={pageSize}
            total={favorites.length} 
            onChange={(page) => setCurrentPage(page)} 
            showSizeChanger= {false}
          />)
        }
        
      </div>
    </div>
  );
};

export default Wishlist;
