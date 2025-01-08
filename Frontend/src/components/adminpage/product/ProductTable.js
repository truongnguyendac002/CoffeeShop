import { useState, useRef } from 'react';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Input,
    Space,
    Table,
    Popconfirm,
    Modal,
    Form,
    Select,
    Image
} from 'antd';
import { AiOutlineBars } from "react-icons/ai";
import { RiEditLine, RiDeleteBinLine  } from "react-icons/ri";
import { PiListStarBold } from "react-icons/pi";
import Highlighter from 'react-highlight-words';
import fetchWithAuth from '../../../helps/fetchWithAuth';
import summaryApi from '../../../common';
import ProductItemModal from './ProductItemModal';
import ReviewModal from './ReviewManagement';

const { Option } = Select;

const ProductTable = ({ products, setProducts, categories, brands, setCategories, setBrands }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [isBrandModalVisible, setIsBrandModalVisible] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newBrandName, setNewBrandName] = useState('');
    const searchInput = useRef(null);

    const [currentProduct, setCurrentProduct] = useState(null);

    const [form] = Form.useForm();

    const [selectedProduct, setSelectedProduct] = useState(
    );
    const [isProductItemsModalVisible, setIsProductItemsModalVisible] = useState(false);

    const showProductItemsModal = (product) => {
        setSelectedProduct(product);
        setIsProductItemsModalVisible(true);
    };

    const closeProductItemsModal = () => {
        setSelectedProduct(null);
        setIsProductItemsModalVisible(false);
    };


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        confirm();
        setSearchText('');
    };
    const closeModel = () => {
        setCurrentProduct(null);
        setIsModalVisible(false);
        if (!currentProduct) form.resetFields();

    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters, confirm)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleDelete = async (id) => {
        const response = await fetchWithAuth(summaryApi.deleteProduct.url + id, {
            method: summaryApi.deleteProduct.method,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.respCode === '000') {
            setProducts(products.filter((product) => product.id !== id));
        } else {
            console.log(data);
        }
    };

    const showModal = (product = null) => {
        setCurrentProduct(product);
        setIsModalVisible(true);
        if (product) {
            form.setFieldsValue({
                name: product.name,
                description: product.description,
                category: product.category?.id,
                brand: product.brand?.id,
            });
        } else {
            if (!currentProduct) form.resetFields();
        }
    }
    const handleUpdateProduct = (values) => {
        const fetchUpdateProduct = async () => {
            const response = await fetchWithAuth(summaryApi.updateProduct.url + currentProduct.id, {
                method: summaryApi.updateProduct.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Name: values.name,
                    Description: values.description,
                    BrandId: values.brand,
                    CategoryId: values.category,
                }),
            });
            const data = await response.json();
            if (data.respCode === '000' && data.data) {
                const updatedProducts = products.map((product) => {
                    if (product.id === currentProduct.id) {
                        return data.data;
                    }
                    return product;
                });
                setProducts(updatedProducts);
                closeModel();
            } else {
                console.log(data);
            }
        };
        fetchUpdateProduct();
    };

    const handleAddProduct = (values) => {
        const fetchAddProduct = async () => {
            const response = await fetchWithAuth(summaryApi.addProduct.url, {
                method: summaryApi.addProduct.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Name: values.name,
                    Description: values.description,
                    BrandId: values.brand,
                    CategoryId: values.category,
                }),
            });
            const data = await response.json();
            if (data.respCode === '000' && data.data) {
                setProducts([...products, data.data]);
                closeModel();
            } else {
                console.log(data);
            }
        };
        fetchAddProduct();
    };


    const handleAddCategory = () => {
        const fetchAddCategory = async () => {
            const response = await fetchWithAuth(summaryApi.addCategory.url, {
                method: summaryApi.addCategory.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCategoryName }),
            });
            const data = await response.json();
            if (data.respCode === '000' && data.data) {
                setCategories([...categories, data.data]);
                setNewCategoryName('');
                setIsCategoryModalVisible(false);
            } else {
                console.log(data);
            }
        };
        fetchAddCategory();
    };


    const handleAddBrand = () => {
        const fetchAddBrand = async () => {
            const response = await fetchWithAuth(summaryApi.addBrand.url, {
                method: summaryApi.addBrand.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newBrandName }),
            });
            const data = await response.json();
            if (data.respCode === '000' && data.data) {
                setBrands([...brands, data.data]);
                setNewBrandName('');
                setIsBrandModalVisible(false);
            } else {
                console.log(data);
            }
        }
        fetchAddBrand();
    };

    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

    const showReviewModal = (product) => {
        setSelectedProduct(product);
        setIsReviewModalVisible(true);
    };

    const closeReviewModal = () => {
        setSelectedProduct(null);
        setIsReviewModalVisible(false);
    };


    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Default Image',
            key: 'productImage',
            render: (_, record) => (
                record.images && record.images.length > 0 ? (
                    <Image
                        src={record.images[0].url}
                        alt="Product"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                ) : (
                    <span>No image</span>
                )
            ),
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',

            ...getColumnSearchProps('name'),
        },
        {
            title: 'Category',
            dataIndex: ['category', 'name'],
            key: 'categoryName',
            render: (text, record) => record.category?.name || 'N/A',
        },
        {
            title: 'Brand',
            dataIndex: ['brand', 'name'],
            key: 'brandName',
            render: (text, record) => record.brand?.name || 'N/A',
        },
        {
            title: 'Description',
            dataIndex: ['description'],
            key: 'descriptionName',
            render: (text, record) => record.description || 'N/A',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div className="grid grid-cols-2 gap-4">
                    {/* Hàng 1 */}
                    <button
                        type="link"
                        onClick={() => showProductItemsModal(record)}
                        className="text-green-500 hover:text-green-400 flex items-center"
                    >
                        <AiOutlineBars className="mr-1 text-xl" /> Thông tin
                    </button>

                    <button
                        type="link"
                        className="text-blue-500 hover:text-blue-400 flex items-center"
                        onClick={() => showModal(record)}
                    >
                        <RiEditLine className="mr-1 text-xl" /> Chỉnh sửa
                    </button>

                    {/* Hàng 2 */}
                    <button
                        type="link"
                        className="text-yellow-500 hover:text-yellow-400 flex items-center"
                        onClick={() => showReviewModal(record)}
                    >
                        <PiListStarBold className="mr-1 text-xl" /> Xem đánh giá
                    </button>

                    <Popconfirm
                        title="Sure to delete this product ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <button
                            type="link"
                            className="text-red-500 hover:text-red-400 flex items-center"
                        >
                            <RiDeleteBinLine  className="mr-1 text-xl" /> Xoá
                        </button>
                    </Popconfirm>
                </div>

            ),
        },
    ];

    return (
        <div className="p-4">
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal(null)}
                className="mb-4"
            >
                Add New Product
            </Button>
            <Table rowKey="id" columns={columns} dataSource={products} />

            <ReviewModal visible={isReviewModalVisible}
                onClose={closeReviewModal}
                product={selectedProduct}
            />

            <ProductItemModal
                product={selectedProduct}
                setProduct={setSelectedProduct}
                visible={isProductItemsModalVisible}
                onClose={closeProductItemsModal}
                setProductList={setProducts}
                productList={products}
            />

            <Modal
                title={currentProduct ? "Update Product" : "Add New Product"}
                open={isModalVisible}
                onCancel={() => closeModel()}
                footer={null}
            >
                <Form form={form} onFinish={currentProduct ? handleUpdateProduct : handleAddProduct} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Product Name"
                        rules={[{ required: true, message: 'Please enter the product name!' }]}
                        initialValue={currentProduct?.name}
                    >
                        <Input placeholder="Enter product name" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Product Description"
                        initialValue={currentProduct?.description}

                    >
                        <Input placeholder="Enter product description" />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                        initialValue={currentProduct?.category?.id}

                    >
                        <Select
                            placeholder="Select a category"
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    {/* <Button
                                        type="text"
                                        className="w-full text-left"
                                        onClick={() => setIsCategoryModalVisible(true)}
                                    >
                                        + Add New Category
                                    </Button> */}
                                </>
                            )}
                        >
                            {categories.map((cat) => (
                                <Option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="brand"
                        label="Brand"
                        rules={[{ required: true, message: 'Please select a brand!' }]}
                        initialValue={currentProduct?.brand?.id}
                    >
                        <Select
                            placeholder="Select a brand"
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Button
                                        type="text"
                                        className="w-full text-left"
                                        onClick={() => setIsBrandModalVisible(true)}
                                    >
                                        + Add New Brand
                                    </Button>
                                </>
                            )}
                        >
                            {brands.map((brand) => (
                                <Option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Button type="primary" htmlType="submit" className="w-full">
                        {currentProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                </Form>
            </Modal>

            {/* Modal for adding category */}
            <Modal
                title="Add New Category"
                open={isCategoryModalVisible}
                onCancel={() => setIsCategoryModalVisible(false)}
                footer={null}
            >
                <Input
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button
                    type="primary"
                    onClick={handleAddCategory}
                    className="mt-2"
                    disabled={!newCategoryName.trim()}
                >
                    Add Category
                </Button>
            </Modal>

            <Modal
                title="Add New Brand"
                open={isBrandModalVisible}
                onCancel={() => setIsBrandModalVisible(false)}
                footer={null}
            >
                <Input
                    placeholder="Enter brand name"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                />
                <Button
                    type="primary"
                    onClick={handleAddBrand}
                    className="mt-2"
                    disabled={!newBrandName.trim()}
                >
                    Add Brand
                </Button>
            </Modal>


        </div>
    );
};

export default ProductTable;
