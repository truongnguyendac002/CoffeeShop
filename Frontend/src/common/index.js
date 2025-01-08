
const backendDomain = "http://localhost:8080/api";

const summaryApi = {
    getConversationOfUser: {
        url: `${backendDomain}/conversation/user/`,
        method: "GET"
    },
    getAllConversation: {
        url: `${backendDomain}/conversation/all`,
        method: "GET"
    },
    createConversation: {
        url: `${backendDomain}/conversation/user`,
        method: "POST"
    },

    signUP: {
        url: `${backendDomain}/auth/register`,
        method: "POST"
    },
    signIn: {
        url: `${backendDomain}/auth/login`,
        method: "POST"
    },
    logout_user: {
        url: `${backendDomain}/api/user-logout`,
        method: "GET"
    },
    current_user: {
        url: `${backendDomain}/auth/user-details`,
        method: "GET"
    },
    forgotPassword: {
        url: `${backendDomain}/forgotPassword/verifyEmail/`,
        method: "POST"
    },
    verifyOtp: {
        url: `${backendDomain}/forgotPassword/verifyOtp/`,
        method: "POST"
    },
    updatePasswordWithOldPassword: {
        url: `${backendDomain}/auth/password`,
        method: "POST"
    },
    changePassword: {
        url: `${backendDomain}/forgotPassword/changePassword/`,
        method: "POST"
    },
    refreshToken: {
        url: `${backendDomain}/auth/refresh-token`,
        method: "POST"
    },
    allCategory: {
        url: `${backendDomain}/category/all`,
        method: "GET"
    },
    addCategory: {
        url: `${backendDomain}/category`,
        method: "POST"
    },
    allBrand: {
        url: `${backendDomain}/brand/all`,
        method: "GET"
    },
    addBrand: {
        url: `${backendDomain}/brand`,
        method: "POST"
    },
    allProduct: {
        url: `${backendDomain}/product/all`,
        method: "GET"
    },
    addProduct: {
        url: `${backendDomain}/product`,
        method: "POST"
    },
    updateProduct: {
        url: `${backendDomain}/product/`,
        method: "PUT"
    },
    deleteProduct: {
        url: `${backendDomain}/product/`,
        method: "DELETE"
    },
    updateCartItem: {
        url: `${backendDomain}/cart/item`,
        method: "PUT"
    },
    getAllCartItems: {
        url: `${backendDomain}/cart/user/`,
        method: "GET"
    },
    addCartItem: {
        url: `${backendDomain}/cart/item`,
        method: "POST"
    },
    deleteCartItem : {
        url: `${backendDomain}/cart/item/`,
        method: "DELETE"
    },
    getAddressByUser: {
        url: `${backendDomain}/address`,
        method: "GET"
    },
    addShippingAddress: {
        url: `${backendDomain}/address`,
        method: "POST"
    },
    updateShippingAddress: {
        url: `${backendDomain}/address`,
        method: "PUT"
    },
    deleteShippingAddress: {
        url: `${backendDomain}/address/`,
        method: "DELETE"
    },

    productDetails: {
        url: `${backendDomain}/product/`,
        method: "GET",
    },
    productItem: {
        url: `${backendDomain}/product-item/`,
        method: "GET",
    },
    addProductItem: {
        url: `${backendDomain}/product-item`,
        method: "POST",
    },
    updateProductItem: {
        url: `${backendDomain}/product-item/`,
        method: "PUT",
    },
    deleteProductItem: {
        url: `${backendDomain}/product-item/`,
        method: "DELETE",
    },

    createRefund: {
        url: `${backendDomain}/payment`,
        method: "POST",
    },

    createOnlinePayment: {
        url: `${backendDomain}/payment`,
        method: "GET",
    },

    addOrder: {
        url: `${backendDomain}/order`,
        method: "POST",
    },
    addReview: {
        url: `${backendDomain}/review`,
        method: "POST",
    },
    deleteReview: {
        url: `${backendDomain}/review/`,
        method: "DELETE",
    },
    getUserOrders: {
        url: `${backendDomain}/order/user/all`,
        method: "GET",
    },
    getProfile: {
        url: `${backendDomain}/profile`,
        method: "GET",
    },
    uploadAvatarProfile: {
        url: `${backendDomain}/profile/avatar`,
        method: "POST",
    },
    getAllUsers: {
        url: `${backendDomain}/user/all`,
        method: "GET",
    },
    processUser: {
        url: `${backendDomain}/user/`,
        method: "PUT",
    },
    searchProduct : {
        url : `${backendDomain}/product/search`,
        method : 'GET'
    },

    addFavorite : {
        url : `${backendDomain}/favorites`,
        method : "POST"
    },
    allFavorites : {
        url : `${backendDomain}/favorites/`,
        method : "GET"
    },
    deleteFavorites : {
        url : `${backendDomain}/favorites`,
        method : "DELETE"
    },
    addType : {
        url : `${backendDomain}/type-product`,
        method : "POST"
    },
    getAllType : {
        url : `${backendDomain}/type-product/all`,
        method : "GET"
    },
    addTransaction : {
        url : `${backendDomain}/transaction`,
        method : "POST"
    },
    getProductByCategory : {
        url : `${backendDomain}/product/category/`,
        method : "GET"
    },
    updateProfile : {
        url : `${backendDomain}/profile`,
        method : "PUT"
    },
    getReviewByProductId : {
        url : `${backendDomain}/review/product/`,
        method : "GET"
    },
    uploadProductImage: {
        url: `${backendDomain}/product/`,
        method: "POST"
    },
    deleteProductImage: {
        url: `${backendDomain}/product/image/`,
        method: "DELETE"
    },
    getAllOrder : {
        url : `${backendDomain}/order/get-all`,
        method : "GET"
    },
    getOrderByStatus : {
        url : `${backendDomain}/order/status/`,
        method : "GET"
    },
    updateOrderStatus : {
        url : `${backendDomain}/order/`,
        method : "PUT"
    },
    getTop5MonthlySellingProduct : {
        url : `${backendDomain}/statistic/product/monthly`,
        method : "GET"
    },
    getTop5BestSellingProduct : {
        url : `${backendDomain}/statistic/product`,
        method : "GET"
    },
    getTop5MonthlyUsers : {
        url : `${backendDomain}/statistic/user/monthly`,
        method : "GET"
    },
    getUsersStatistic : {
        url : `${backendDomain}/statistic/user`,
        method : "GET"
    },
    getAllBrand : {
        url : `${backendDomain}/brand/all`,
        method : "GET"
    },
    deleteBrand : {
        url : `${backendDomain}/brand`,
        method : "DELETE"
    },
    updateBrand : {
        url : `${backendDomain}/brand`,
        method : "PUT"
    },
    updateCategory : {
        url : `${backendDomain}/category`,
        method : "PUT"
    },
    deleteCategory : {
        url : `${backendDomain}/category`,
        method : "DELETE"
    },
    getOrderDetails : {
        url : `${backendDomain}/order`,
        method : "GET"
    },
    cancelOrder : {
        url : `${backendDomain}/order/cancel-order/`,
        method : "PUT"
    },
    cancelOrderAndRefund : {
        url : `${backendDomain}/payment`,
        method : "POST"
    }
}

export default summaryApi;
