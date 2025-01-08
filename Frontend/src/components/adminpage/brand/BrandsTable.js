import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined  } from '@ant-design/icons';
import fetchWithAuth from '../../../helps/fetchWithAuth';
import summaryApi from '../../../common';
import Search from 'antd/es/transfer/search';
import { toast } from 'react-toastify';

const BrandTable = ({ brands, setBrands }) => {
    // const [brands, setBrands] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [currentBrand, setCurrentBrand] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [nameError, setNameError] = useState('');

    const handleAddOrUpdateBrand = (values) => {
        const url = currentBrand ? `${summaryApi.updateBrand.url}/${currentBrand.id}` : summaryApi.addBrand.url;
        const method = currentBrand ? summaryApi.updateBrand.method : summaryApi.addBrand.method;

        const fetchAddOrUpdateBrand = async () => {
            const response = await fetchWithAuth(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: values.name }),
            });
            const data = await response.json();
            if (data.respCode === '000' && data.data) {
                setNameError('')
                currentBrand? toast.success("Chỉnh sửa nhãn hàng thành công!") : toast.success("Thêm nhãn hàng thành công!")
                if (currentBrand) {
                    setBrands(brands.map(brand => brand.id === currentBrand.id ? data.data : brand));
                } else {
                    setBrands([...brands, data.data]);
                }
                setIsModalVisible(false);
                form.resetFields();
                setCurrentBrand(null);
            } else {
                console.log(data);
                currentBrand? toast.error("Chỉnh sửa nhãn hàng không thành công! Vui lòng thử lại sau!") : toast.error("Thêm nhãn hàng không thành công! Vui lòng thử lại sau!")
            }
            if(data.respCode === '100'){
                setNameError('Tên nhãn hàng không được để trống!')
            }
            if(data.respCode === '102'){
                setNameError('Nhãn hàng đã tồn tại!')
            }
        };
        fetchAddOrUpdateBrand();
    };

    const handleDeleteBrand = (id) => {
        const fetchDeleteBrand = async () => {
            const response = await fetchWithAuth(`${summaryApi.deleteBrand.url}/${id}`, {
                method: summaryApi.deleteBrand.method,
            });
            const data = await response.json();
            if (data.respCode === '000') {
                toast.success('Xóa nhãn hàng thành công!')
                setBrands(brands.filter(brand => brand.id !== id));
            } else {
                console.log(data);
                toast.error('Xóa nhãn hàng thất bại! Vui lòng thử lại sau!')
            }
        };
        fetchDeleteBrand();
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
            title: 'Mã nhãn hàng',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên nhãn hàng',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps("name")
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        onClick={() => {
                            setCurrentBrand(record);
                            form.setFieldsValue({ name: record.name });
                            setIsModalVisible(true);
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa nhãn hàng này không?"
                        onConfirm={() => handleDeleteBrand(record.id)}
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
                        setCurrentBrand(null);
                        form.resetFields();
                        setIsModalVisible(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    icon={<PlusOutlined />}
                >
                    Thêm nhãn hàng mới
                </Button>
            </div>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={brands}
                className="rounded-lg overflow-hidden"
            />

            <Modal
                title={currentBrand ? "Chỉnh sửa nhãn hàng" : "Thêm nhãn hàng mới"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                className="rounded-lg"
            >
                <Form form={form} onFinish={handleAddOrUpdateBrand} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên nhãn hàng"
                        rules={[{ required: true, message: 'Vui lòng nhập tên nhãn hàng!' }]}
                        help={nameError}
                        validateStatus={nameError ? 'error' : ''}
                    >
                        <Input placeholder="Nhập tên nhãn hàng" className="rounded-md" />
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    >
                        {currentBrand ? "Cập nhật nhãn hàng" : "Thêm nhãn hàng"}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default BrandTable;
