import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import summaryApi from "../common";
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { LoadingOutlined } from "@ant-design/icons";

import image1 from "../assets/img/empty.jpg";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, toggleSelected } from "../store/cartSlice";
import fetchWithAuth from "../helps/fetchWithAuth";
import {  message, Modal } from "antd";
import {
  selectFavorites,
  removeFromFavorites,
  addToFavorites,
  setFavorites,
} from "../store/favoritesSlice ";
import ListReview from "../components/layout/ListReview";
import ProductRating from "../components/layout/ProductRating";
import DescriptionProduct from "../components/layout/DescriptionProduct";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [productItems, setProductItems] = useState([]);
  const [itemStock, setItemStock] = useState(null);
  const [clickButtonSize, setClickButtonSize] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [productItemPrice, setProductItemPrice] = useState(null);
  const [productItem, setProductItem] = useState(null);
  const [activeTab, setActiveTab] = useState("Description");
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkQuantity , setCheckQuantity] =  useState(0);

  const user = useSelector((store) => store?.user?.user);
  const cartItems = useSelector((store) => store.cart.items);
  const favorites = useSelector(selectFavorites);
  const selectedItems = cartItems
    ? cartItems.filter((item) => item.isSelected)
    : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const maxQuantity = itemStock;
  const tabs = ["Description", "Review"];

  const [isFavorite, setIsFavorite] = useState(false);

  const [imageLoadStatus, setImageLoadStatus] = useState(
    images.map(() => false) // Tạo trạng thái tải cho từng ảnh
  );

  useEffect(() => {
    if (product) {
      const isProductFavorite = favorites.some((item) => {
        return item.id === product.id;
      });
      setIsFavorite(isProductFavorite);
    }
  }, [product, favorites]);

  useEffect(() => {
    const fetchProductItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(summaryApi.productItem.url + `${id}`, {
          method: summaryApi.productItem.method,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result.respCode === "000") {
          setProductItems(result.data);
          setProduct(result.data[0].productResponse);
          setImages(result.data[0].productResponse.images);
          setCurrentImage(0);

          if (result.data.length > 0) {
            setProductItemPrice(result.data[0].price);
          }
        } else {
          console.log("Error:", result.respDesc);
        }
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductItems();
  }, [id]);

  const handlePrevClick = () => {
    setCurrentImage((prevImage) =>
      prevImage === 0 ? images.length - 1 : prevImage - 1
    );
  };
  const handleNextClick = () => {
    setCurrentImage((prevImage) =>
      prevImage === images.length - 1 ? 0 : prevImage + 1
    );
  };

  const decrement = () => {
    if (!maxQuantity) {
      setError("Bạn cần chọn loại sản phẩm trước");
    }
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increment = () => {
    if (!maxQuantity) {
      setError("Bạn cần chọn loại sản phẩm trước");
    }
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleClickSize = (item) => {
    setItemStock(item.stock);
    setClickButtonSize(item);
    setSelectedDiscount(item.discount);
    setProductItemPrice(item.price);
    setProductItem(item);
    setError(null);
  };

  const handleImageLoad = (index) => {
    setImageLoadStatus((prev) => {
      const updatedStatus = [...prev];
      updatedStatus[index] = true;
      return updatedStatus;
    });
  };

  const handleAddProductToCart = async () => {
    if (!user) {
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có muốn đăng nhập để tiếp tục mua hàng?",
        okText: "Đăng nhập",
        cancelText: "Hủy",
        onOk: () => {
          navigate("/login");
        },
      });
      return;
    }
    if (!productItem) {
      setError("Bạn cần chọn loại sản phẩm trước khi thêm vào giỏ hàng!");
      toast.error("Chưa chọn loại sản phẩm");
      return;
    }

    const checkItem = cartItems.find((item) =>  item.productItemResponse.id === productItem.id)  ;
    if(checkItem && (checkItem.quantity + quantity >  maxQuantity)) {
      setCheckQuantity(checkItem.quantity)
       showModal();
       return;
    }

    try {
      const response = await fetchWithAuth(summaryApi.addCartItem.url, {
        method: summaryApi.addCartItem.method,
        body: JSON.stringify({
          ProductItemId: productItem.id,
          Quantity: quantity,
          UserId: user.id,
        }),
      });

      const data = await response.json();
      if (data.respCode === "000") {
        dispatch(addToCart(data.data));
        message.success("Đã thêm sản phẩm vào giỏ hàng");

        return data.data;
      } else {
        throw new Error("Lỗi khi thêm vào giỏ hàng");
      }
    } catch (error) {
      console.log("Lỗi khi thêm vào giỏ hàng:  d", error);
    }
  };

  const handleAddToCart = async () => {
    await handleAddProductToCart();
  };

  const handleBuyNow = async () => {
    try {
      const addedProduct = await handleAddProductToCart();
      if (addedProduct) {
        const isSelected = selectedItems.some(
          (item) => item.id === addedProduct.id
        );

        if (!isSelected) {
          dispatch(toggleSelected({ itemId: addedProduct.id }));
        }
        navigate("/checkout");
      }
    } catch (error) {
      console.error("Lỗi khi thực hiện mua ngay:", error);
      message.error("Không thể thực hiện mua ngay. Vui lòng thử lại sau.");
    }
  };

  const handleClickFavorites = async () => {
    const isAlreadyFavorite = isFavorite;

    if(!user) {
      Modal.confirm ({
        title : "",
        content: "Bạn cần phải đăng nhập để có thể thêm sản phẩm vào danh sách yêu thích", 
        okText: "Đăng nhập",
        cancelText: "Cancel",
        onOk : () => {
          navigate('/login')
        },
      })
      return;
    }

    if (isAlreadyFavorite) {
      try {
        const response = await fetchWithAuth(summaryApi.deleteFavorites.url, {
          method: summaryApi.deleteFavorites.method,
          body: JSON.stringify({
            ProductId: product.id,
            UserId: user.id,
          }),
        });

        const data = await response.json();
        if (data.respCode === "000") {
          dispatch(removeFromFavorites(product));
          dispatch(
            setFavorites(favorites.filter((item) => item.id !== product.id))
          );

          message.success("Sản phẩm đã được xóa khỏi danh sách yêu thích");
        } else {
          throw new Error("Lỗi khi xóa sản phẩm vào danh sách yêu thích");
        }
      } catch (error) {
        console.log("Lỗi khi xóa sản phẩm vào danh sách yêu thích:", error);
      }
    } else {
      try {
        const response = await fetchWithAuth(summaryApi.addFavorite.url, {
          method: summaryApi.addFavorite.method,
          body: JSON.stringify({
            ProductId: product.id,
            UserId: user.id,
          }),
        });

        const data = await response.json();
        if (data.respCode === "000") {
          dispatch(addToFavorites(product));
          message.success("Sản phẩm đã được thêm vào danh sách yêu thích");
        } else {
          throw new Error("Lỗi khi thêm sản phẩm vào danh sách yêu thích");
        }
      } catch (error) {
        console.log("Lỗi khi thêm sản phẩm vào danh sách yêu thích:", error);
      }
    }
  };

  const renderContent = (product) => {
    if (!product || !product.brand || !product.category) {
      return <p>Loading...</p>;
    }
    switch (activeTab) {
      case "Description":
        return <DescriptionProduct product={product} />;
      case "Review":
        return <ListReview productId={product.id} />;
      default:
        return null;
    }
  };


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto mt-3">
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <LoadingOutlined style={{ fontSize: 48, color: "red" }} spin />
        </div>
      )}
      <div className="shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
        {!isLoading && (
          <div className="p-6 md:w-2/5 w-full bg-white flex flex-col items-center">
            <div className="relative">
              {!imageLoadStatus[currentImage] && (
                <div className="absolute inset-0  flex items-center justify-center">
                  <LoadingOutlined className="text-3xl text-gray-400" spin />
                </div>
              )}
              <img
                className={`md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[380px] w-60 h-60 rounded-md object-cover transition-opacity duration-300 ${
                  imageLoadStatus[currentImage] ? "opacity-100" : "opacity-0"
                }`}
                src={images.length > 0 ? images[currentImage].url : image1}
                alt="Main product"
                onLoad={() => handleImageLoad(currentImage)}
              />
            </div>
            <div className="mt-8 relative max-w-full">
              <div
                className="grid gap-3 lg:gap-1"
                style={{
                  gridTemplateColumns:
                    images.length > 0
                      ? `repeat(${images.length}, 1fr)`
                      : "repeat(4, 1fr)", 
                }}
              >
                {(images.length > 0
                  ? images
                  : Array(4).fill({ url: image1 })
                ).map((image, index) => (
                  <div key={index} className="relative">
                    {!imageLoadStatus[index] && (
                      <div className="absolute inset-0  flex items-center justify-center">
                        <LoadingOutlined
                          className="text-xl text-gray-400"
                          spin
                        />
                      </div>
                    )}
                    <img
                      className={`w-16 h-16 lg:h-24 lg:w-24 object-cover rounded-lg shadow-md cursor-pointer transition-opacity duration-300 ${
                        index === currentImage ? "border-2 border-red-500" : ""
                      } ${
                        imageLoadStatus[index] ? "opacity-100" : "opacity-0"
                      }`}
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      onLoad={() => handleImageLoad(index)}
                      onClick={() => setCurrentImage(index)}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handlePrevClick}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-50 text-gray-800 pr-2 py-2 shadow-md focus:outline-none"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNextClick}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-50 text-gray-800 pr-2 py-2 shadow-md focus:outline-none"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="bg-gray-100 md:w-3/5 w-full p-8 flex flex-col justify-between">
          <div>
            <h2 className="lg:text-2xl md:text-xl text-lg font-bold">
              {product.name}
            </h2>
            <ProductRating product={product} />

            {/* Discount */}
            <div className="lg:mt-8 mt-5 flex items-baseline justify-start space-x-10">
              <div className="lg:w-1/6 w-1/5">
                <h2 className="lg:text-xl md:text-lg text-base">Discount</h2>
              </div>
              <div className="flex gap-x-4 gap-y-3 flex-wrap">
                {selectedDiscount > 0 ? (
                  <button className="shrink-0 w-28 h-8 border-dashed border-2 bg-red-100 text-red-500 font-semibold rounded-sm text-lg">
                    {`- ${Number(selectedDiscount).toLocaleString("vi-VN")}đ`}
                  </button>
                ) : selectedDiscount === 0.0 ? (
                  <p className="text-red-400">
                    Sản phẩm này không có mã giảm giá
                  </p>
                ) : (
                  <p className="text-red-400">Chọn size để xem mã giảm giá</p>
                )}
              </div>
            </div>

            {/* Size */}
            <div className="lg:mt-8 mt-5 flex items-baseline justify-start space-x-10">
              <div className="lg:w-1/6 w-1/5">
                <h2 className="lg:text-xl md:text-lg text-base">Size</h2>
              </div>
              <div className="flex gap-x-4 gap-y-3 flex-wrap">
                {productItems.map((item, index) => (
                  <button
                    disabled={item.stock === 0}
                    key={index}
                    onClick={() => handleClickSize(item)}
                    className={`shrink-0 w-28 h-8 rounded-sm text-sm border-2 ${
                      clickButtonSize === item
                        ? "border-orange-500 text-red-500"
                        : "bg-white hover:border-orange-500 hover:text-red-500"
                    }${item.stock === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : ""}` }
                  >
                    {item.type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="lg:mt-8 mt-5 flex items-baseline justify-start lg:space-x-10 md:space-x-6 sm:space-x-4 space-x-4">
              <div className="lg:w-1/6 w-1/5">
                <h2 className="lg:text-xl md:text-lg text-base">Số lượng</h2>
              </div>
              <div className="flex items-center">
                <button
                  onClick={decrement}
                  className="px-2 py-1 text-gray-800 rounded-l focus:outline-none border border-solid"
                  // disabled={!maxQuantity}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(1, Math.min(maxQuantity, e.target.value))
                    )
                  }
                  className="lg:w-20 px-2 md:w-14 w-16 py-1 text-center border-t border-b border-gray-300 focus:outline-none"
                />
                <button
                  onClick={increment}
                  className="px-2 py-1 text-gray-800 rounded-r focus:outline-none border border-solid"
                  // disabled={!maxQuantity}
                >
                  +
                </button>
              </div>
              <p className="mt-2 text-gray-700">
                {itemStock > 0 ? (
                  `${itemStock.toLocaleString()} sản phẩm có sẵn`
                ) : itemStock === 0 ? (
                  <span className="text-red-400">
                    Hiện tại không còn sản phẩm
                  </span>
                ) : (
                  <span></span>
                )}
              </p>
            </div>

            {/* Price */}
            <div className="lg:mt-8 mt-5 flex items-baseline justify-start space-x-10">
              <div className="lg:w-1/6 w-1/5">
                <h2 className="lg:text-xl md:text-lg text-base">Giá</h2>
              </div>
              <div className="flex gap-x-4 gap-y-3 flex-wrap">
                {selectedDiscount ? (
                  <div className="flex items-center space-x-5">
                    <p className="text-gray-500 line-through text-lg">
                      {Number(productItemPrice).toLocaleString("vi-VN")}đ
                    </p>
                    <p className="font-semibold text-red-500 text-2xl">
                      {Number(productItemPrice - selectedDiscount).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                ) : (
                  <p className="font-semibold text-red-500 text-2xl">
                    {Number(productItemPrice).toLocaleString("vi-VN")}đ
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex lg:mt-8 lg:w-5/6 flex-col mt-5">
              {error && <div className="text-red-500 mb-2">{error}</div>}
              <div className="flex md:space-x-5 space-x-2">
                <button
                  onClick={handleAddToCart}
                  className="grow flex items-center justify-center md:px-4 py-2 bg-red-100 border border-red-500 text-red-500 hover:bg-white"
                >
                  <FaShoppingCart className="md:text-lg text-sm mr-2" /> Thêm
                  Vào Giỏ Hàng
                </button>

                <button
                  onClick={handleBuyNow}
                  className="grow md:px-4 py-2 bg-red-500 text-white hover:bg-red-600"
                >
                  Mua Ngay
                </button>
                {!isFavorite ? (
                  <button
                    onClick={handleClickFavorites}
                    className="text-gray-500 hover:text-red-500 w-9"
                  >
                    <FaHeart style={{ width: "32px", height: "32px" }} />
                  </button>
                ) : (
                  <button
                    onClick={handleClickFavorites}
                    className="text-red-500 w-9"
                  >
                    <FaHeart style={{ width: "32px", height: "32px" }} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full lg:mt-10 mt-6">
        <div className="flex border-b border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-semibold ${
                activeTab === tab ? "border-b-2 border-orange-500" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4">{renderContent(product)}</div>
      </div>

      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <button key="ok" type="primary" onClick={handleOk} className="w-full py-1 rounded-md text-base  bg-red-500 text-white hover:bg-red-600">
            OK
          </button>,
        ]}
        centered
        closable={false} 
      >
        <p className="  text-base font-normal mt-10 mb-20">
          Bạn đã có {checkQuantity} sản phẩm này trong giỏ hàng. Không thể thêm số lượng đã chọn vào
          giỏ hàng vì sẽ vượt quá giới hạn mua hàng của bạn.
        </p>
      </Modal>

    
    </div>
  );
};

export default ProductDetail;
