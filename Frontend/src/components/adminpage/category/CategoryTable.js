import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, Image, Popconfirm, Spin  } from 'antd';
import { PlusOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import fetchWithAuth from '../../../helps/fetchWithAuth';
import summaryApi from '../../../common';
import { toast } from 'react-toastify';

const CategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [currentCategory, setCurrentCategory] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            
            const response = await fetchWithAuth(summaryApi.allCategory.url, {
                method: summaryApi.allCategory.method,
            });
            const data = await response.json();
            if (data.respCode === '000' && data.data) {
                setCategories(data.data);
            } else {
                console.log(data);
            }
        };
        fetchCategories();
    }, []);

    const handleAddOrUpdateCategory = (values) => {
        const api = currentCategory ? summaryApi.updateCategory : summaryApi.addCategory;
        const url = currentCategory ? `${api.url}/${currentCategory.id}` : api.url;
        const method = currentCategory ? api.method : api.method;

        const fetchAddOrUpdateCategory = async () => {
            setLoading(true)
            try {
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("description", values.description);
                if (values.image && values.image[0]) {
                    formData.append('image', values.image[0].originFileObj);
                }
                formData.forEach((value, key) => {
                    console.log(`${key}:`, value);
                });
                const response = await fetchWithAuth(url, {
                    method: method,
                    body: formData,
                });
                const data = await response.json();
                if (data.respCode === '000' && data.data) {
                    setNameError('')
                    currentCategory ? toast.success('Chỉnh sửa danh mục thành công!') : toast.success('Thêm danh mục thành công!')
                    if (currentCategory) {
                        setCategories(categories.map(category => 
                            category.id === currentCategory.id ? data.data : category
                        ));
                    } else {
                        setCategories([...categories, data.data]);
                    }
                    setIsModalVisible(false);
                    form.resetFields();
                    setCurrentCategory(null);
                }
                if(data.respCode === '100'){
                    setNameError('Tên danh mục không được để trống!')
                }
                if(data.respCode === '102'){
                    setNameError('Danh mục đã tồn tại!')
                }
            } catch (error) {
                console.error('Error:', error);
                currentCategory? toast.error('Chỉnh sửa danh mục không thành công!') : toast.error('Thêm danh mục không thành công! Vui lòng thử lại sau!')
            }
            setLoading(false)
        };
        fetchAddOrUpdateCategory();
    };

    const handleDeleteCategory = (id) => {
        setLoading(true)
        const fetchDeleteCategory = async () => {
            const response = await fetchWithAuth(`${summaryApi.deleteCategory.url}/${id}`, {
                method: summaryApi.deleteCategory.method,
            });
            const data = await response.json();
            if (data.respCode === '000') {
                toast.success('Xóa danh mục thành công!')
                setCategories(categories.filter(category => category.id !== id));
            } else {
                toast.error('Xóa danh mục không thành công! Vui lòng thử lại sau!')
            }
            setLoading(false)
        };
        fetchDeleteCategory();
        
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Tìm kiếm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Tìm kiếm
                </Button>
                <Button
                    onClick={() => handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Xóa
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
    });

    const columns = [
        {
            title: 'Mã danh mục',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Ảnh bìa',
            key: 'image',
            render: (_, record) => (
                record.defaultImageUrl ? (
                    <Image
                        src={record.defaultImageUrl}
                        alt={record.name}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                    />
                ) : (
                    <span>Chưa cập nhật</span>
                )
            ),
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name')
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        onClick={() => {
                            setCurrentCategory(record);
                            form.setFieldsValue({
                                name: record.name,
                                description: record.description,
                                image: record.defaultImageUrl
                                    ? [
                                        {
                                            uid: '-1',
                                            name: 'image.png',
                                            status: 'done',
                                            url: record.defaultImageUrl,
                                        },
                                    ]
                                    : [],
                            });
                            setIsModalVisible(true);
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa danh mục này không?"
                        onConfirm={() => handleDeleteCategory(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="link" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="flex justify-start items-center mb-4">
                <Button
                    type="primary"
                    onClick={() => {
                        setCurrentCategory(null);
                        form.resetFields();
                        setIsModalVisible(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    icon={<PlusOutlined />}
                >
                    Thêm danh mục mới
                </Button>
            </div>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={categories}
                className="rounded-lg overflow-hidden"
            />

            <Modal
                title={currentCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setCurrentCategory(null);
                    form.resetFields();
                }}
                footer={null}
                className="rounded-lg"
            >
                <Form form={form} onFinish={handleAddOrUpdateCategory} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên danh mục"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                        help={nameError}
                        validateStatus={nameError ? 'error' : ''}
                    >
                        <Input placeholder="Nhập tên danh mục" className="rounded-md" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea
                            placeholder="Nhập mô tả danh mục"
                            className="rounded-md"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Ảnh bìa"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e?.fileList;
                        }}
                    >
                                <Upload
                                listType="picture-card"
                                maxCount={1}
                                beforeUpload={() => false}
                                >
                                <div>
                                <PlusOutlined className="text-gray-400"/>
                                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                </div>
                        </Upload>
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    >
                        {currentCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryTable;
