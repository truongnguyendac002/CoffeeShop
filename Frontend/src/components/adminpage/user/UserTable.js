import { useState, useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Popconfirm } from 'antd';
import Highlighter from 'react-highlight-words';
import fetchWithAuth from '../../../helps/fetchWithAuth';
import summaryApi from '../../../common';

const UserTable = ({ userList, setUserList }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

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
    const handleBan = async (key) => {
        const response = await fetchWithAuth(
            summaryApi.processUser.url + key + '/ban',
            {
                method: summaryApi.processUser.method,
            }
        )
        const dataResponse = await response.json();
        if (dataResponse.respCode === '000') {
            const newData = userList.map((item) => {
                if (item.id === key) {
                    return { ...item, status: 'INACTIVE' };
                }
            
                return item;
            });
            setUserList(newData);
        }

    };
    const handleUnBan = async (key) => {
        const response = await fetchWithAuth(
            summaryApi.processUser.url + key + '/unban',
            {
                method: summaryApi.processUser.method,
            }
        )
        const dataResponse =await response.json();
        if (dataResponse.respCode === '000') {
            const newData = userList.map((item) => {
                if (item.id === key) {
                    return { ...item, status: 'ACTIVE' };
                }
                return item;
            });
            setUserList(newData);
        }
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"

                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>

                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex] ?
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : false,
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });



    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Avatar',
            dataIndex: 'profile_img',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (_, record) =>
                userList.length >= 1 ? (
                    record.status === 'ACTIVE' ?
                        <Popconfirm title="Sure to ban this user?" onConfirm={() => handleBan(record.id)}>
                            <p className=' text-green-600 cursor-pointer' >Active</p>
                        </Popconfirm>
                        : <Popconfirm title="Sure to unban this user?" onConfirm={() => handleUnBan(record.id)}>
                            <p className='text-red-600 cursor-pointer' >Inactive</p>
                        </Popconfirm>
                ) : null,
        },

    ];
   


    return (
        <div>
            <Table
                className='rounded-lg'
               
                columns={columns}
                dataSource={userList}
                rowKey="id"
            />

        </div>
    );
}
export default UserTable;