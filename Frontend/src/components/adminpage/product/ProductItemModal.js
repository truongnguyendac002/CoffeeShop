import React, { useEffect, useState } from 'react';
import { Modal, Table, Button, Form, Input, InputNumber, Select, Upload, message, Popconfirm } from 'antd';
import fetchWithAuth from '../../../helps/fetchWithAuth';
import summaryApi from '../../../common';
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";


const AddItemModal = ({ visible, onClose, onSave, types, onAddType, editingItem }) => {
    const [form] = Form.useForm();
    const [isAddingType, setIsAddingType] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');

    useEffect(() => {
        if (editingItem) {
            form.setFieldsValue({
                price: editingItem.price,
                stock: editingItem.stock,
                discount: editingItem.discount,
                type: editingItem.type?.name,
            });
        } else {
            form.resetFields();
        }
    }, [editingItem, form]);

    const handleSave = () => {
        form.validateFields().then((values) => {
            onSave(values, editingItem?.id);
            form.resetFields();
        });
    };

    const handleAddType = async () => {
        if (newTypeName.trim()) {
            try {
                const response = await fetchWithAuth(summaryApi.addType.url, {
                    method: summaryApi.addType.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newTypeName }),
                });
                const result = await response.json();
                if (response && result.respCode === '000') {
                    onAddType(result.data);
                    setNewTypeName('');
                    setIsAddingType(false);
                } else {
                    console.error('Failed to add type:', result.message || 'Unknown error');
                }
            } catch (error) {
                console.error('Error adding type:', error);
            }
        }
    };




    return (
        <Modal
            title={editingItem ? "Cập nhật item" : "Thêm mới item"}
            open={visible}
            onCancel={onClose}
            onOk={handleSave}
            okText={editingItem ? "Cập nhật" : "Lưu"}
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Discount"
                    name="discount"
                    rules={[{ required: true, message: 'Vui lòng nhập giảm giá' }]}
                >
                    <InputNumber min={0}   style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                >
                    <Select
                        placeholder="Chọn loại sản phẩm"
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Button
                                    type="text"
                                    style={{ width: '100%', textAlign: 'left' }}
                                    onClick={() => setIsAddingType(true)}
                                >
                                    + Thêm loại mới
                                </Button>
                            </>
                        )}
                    >
                        {types.map((type) => (
                            <Select.Option key={type.id} value={type.name}>
                                {type.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>

            {isAddingType && (
                <Modal
                    title="Thêm loại mới"
                    open={isAddingType}
                    onCancel={() => setIsAddingType(false)}
                    onOk={handleAddType}
                    okText="Lưu"
                    cancelText="Hủy"
                >
                    <Input
                        placeholder="Nhập tên loại mới"
                        value={newTypeName}
                        onChange={(e) => setNewTypeName(e.target.value)}
                    />
                </Modal>
            )}
        </Modal>
    );
};


const ProductItemsModal = ({ product, setProduct, visible, onClose, setProductList, productList }) => {
    const [productItems, setProductItems] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        const fetchProductItems = async () => {
            setLoading(true);
            try {
                const response = await fetchWithAuth(
                    summaryApi.productItem.url + product.id,
                    {
                        method: summaryApi.productItem.method,
                    }
                );
                const data = await response.json();
                if (data && data.respCode === '000') {
                    setProductItems(data.data);
                }
            } catch (error) {
                console.error('Error fetching product items:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchTypes = async () => {
            try {
                const response = await fetchWithAuth(summaryApi.getAllType.url, {
                    method: summaryApi.getAllType.method,
                });
                const data = await response.json();
                if (data && data.respCode === '000') {
                    setTypes(data.data);
                }
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };


        if (product && visible) {
            fetchProductItems();
            fetchTypes();
        }
    }, [product, visible]);

    const handleAddImage = async (file) => {
        const fetchAddImage = async () => {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const response = await fetchWithAuth(
                    summaryApi.uploadProductImage.url + product.id + "/image", {
                    method: summaryApi.uploadProductImage.method,
                    body: formData,
                });
                const data = await response.json();
                if (data && data.respCode === '000') {
                    const product = data.data;
                    setProduct(product);
                    const productListUpdate = productList.map((item) => {
                        if (item.id === product.id) {
                            return product;
                        }
                        return item;
                    });
                    setProductList(productListUpdate);
                    message.success("Ảnh đã được thêm thành công.");
                } else {
                    console.error('Failed to upload image:', data || 'Unknown error');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        };
        fetchAddImage();
    };

    const handleRemoveImage = async (id) => {
        // Xử lý xóa ảnh
        const fetchRemoveImage = async (id) => {
            try {
                const response = await fetchWithAuth(summaryApi.deleteProductImage.url + id, {
                    method: summaryApi.deleteProductImage.method,
                });
                const data = await response.json();
                if (data && data.respCode === '000') {
                    const product = data.data;
                    setProduct(product);
                    message.success("Ảnh đã được xóa.");

                } else {
                    console.error('Failed to remove image:', data || 'Unknown error');
                }
            } catch (error) {
                console.error('Error removing image:', error);
            }
        };
        fetchRemoveImage(id);
    };

    const handleAddNewItem = (newItem) => {
        const { price, stock, discount, type } = newItem;
        const selectedType = types.find((t) => t.name === type); // Tìm đối tượng type đầy đủ
        if (!selectedType) {
            console.error('Type không hợp lệ:', type);
            return;
        }

        if(discount >  price) {
            message.error("Discount không hợp lệ ")
            return;
        }

        const fetchAddItem = async () => {
            try {
                const response = await fetchWithAuth(summaryApi.addProductItem.url, {
                    method: summaryApi.addProductItem.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ProductId: product.id,
                        Price: price,
                        Stock: stock,
                        Discount: discount,
                        TypeId: selectedType.id,
                    }),
                });
                const data = await response.json();
                if (data && data.respCode === '000') {
                    setProductItems((prevItems) => [...prevItems, data.data]);
                    setIsAdding(false);

                }
                else {
                    console.error('Failed to add new item:', data || 'Failed to add new item: Unknown error');
                }
            } catch (error) {
                console.error('Error adding new item:', error);
            }
        };
        fetchAddItem();
    };
    const handleSaveItem = (item, itemId) => {
        if (itemId) {
            // Update existing item
            if(item.discount >  item.price) {
                message.error("Discount không hợp lệ ")
                return;
            }

            const fetchUpdateItem = async () => {
                try {
                    const response = await fetchWithAuth(
                        `${summaryApi.updateProductItem.url}${itemId}`,
                        {
                            method: summaryApi.updateProductItem.method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                Price: item.price,
                                Stock: item.stock,
                                Discount: item.discount,
                                TypeId: types.find((t) => t.name === item.type)?.id,
                                ProductId: product.id,
                            }),
                        }
                    );
                    const data = await response.json();
                    if (data && data.respCode === '000') {
                        setProductItems((prevItems) =>
                            prevItems.map((i) => (i.id === itemId ? data.data : i))
                        );
                        setEditingItem(null);
                        setIsAdding(false);
                    }
                } catch (error) {
                    console.error('Error updating item:', error);
                }
            };
            fetchUpdateItem();
        } else {
            handleAddNewItem(item);
        }
    };


    const handleAddType = (type) => {
        setTypes((prevTypes) => [...prevTypes, type]);
    };

    const handleDeleteItem = (item) => {
        const fetchDeleteItem = async () => {
            try {
                const response = await fetchWithAuth(
                    summaryApi.deleteProductItem.url + item.id,
                    {
                        method: summaryApi.deleteProductItem.method,
                    }
                );
                const data = await response.json();
                if (data && data.respCode === '000') {
                    setProductItems((prevItems) =>
                        prevItems.filter((i) => i.id !== item.id)
                    );
                } else {
                    console.error('Failed to delete item:', data || 'Unknown error');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        };
        fetchDeleteItem();
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: 'Type',
            dataIndex: ['type', 'name'],
            key: 'type',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button
                        type="primary" ghost

                        onClick={() => {
                            setEditingItem(record);
                            setIsAdding(true);
                        }}
                        className='mr-2'
                    >
                        Update
                    </Button>


                    <Popconfirm
                        title="Sure to delete this item ?"
                        onConfirm={() => handleDeleteItem(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button  danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </>
            ),
        }
    ];

    return (
        <>
            <Modal
                title={`Product Items - ${product?.name}`}
                open={visible}
                onCancel={onClose}
                footer={[
                    <Button icon={<PlusOutlined />} key="add" type="primary" onClick={() => setIsAdding(true)}>
                        Thêm mới item
                    </Button>,

                ]}
                width={800}
            >
                <>
                    {/* Hiển thị danh sách ảnh */}
                    <div className="mt-4 p-4 rounded-md">
                        <div className="flex flex-wrap gap-4">
                            {product?.images?.map((img) => (
                                <div key={img.id} className="relative w-32 h-32">
                                    <img
                                        src={img.url}
                                        alt="product"
                                        className="w-full h-full object-cover rounded-md border"
                                    />
                                    <button
                                        onClick={() => handleRemoveImage(img.id)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        <CloseOutlined />
                                    </button>
                                </div>
                            ))}
                            {/* Nút thêm ảnh */}
                            <Upload
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    handleAddImage(file);
                                    return false;
                                }}

                            >
                                <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer">
                                    <PlusOutlined className="text-gray-400" />
                                </div>
                            </Upload>
                        </div>
                    </div>
                </>
                <Table
                    rowKey="id"
                    dataSource={productItems}
                    columns={columns}
                    loading={loading}
                    pagination={false}
                />

            </Modal>
            <AddItemModal
                visible={isAdding}
                onClose={() => {
                    setEditingItem(null);
                    setIsAdding(false);
                }}
                onSave={handleSaveItem}
                types={types}
                onAddType={handleAddType}
                editingItem={editingItem}
            />


        </>
    );
};

export default ProductItemsModal;
