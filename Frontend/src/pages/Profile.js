import React, { useState } from "react";
import { Typography, List, Spin, Form, Button, Modal, message } from "antd";
import { UserOutlined, LoadingOutlined, EditOutlined } from "@ant-design/icons";
import {
  FiHome,
  FiMail,
  FiGift,
  FiAlertCircle,
  FiPhone,
  FiKey,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";
import PasswordInput from "../components/validateInputForm/PasswordInput";
import { TbInfoSquare } from "react-icons/tb";
import fetchWithAuth from "../helps/fetchWithAuth";
import summaryApi from "../common";
import Wishlist from "../components/profile/wishlist";
import Address from "../components/profile/address";
import Info from "../components/profile/InforProfile";
import OrderHistory from "../components/profile/orderHistory";
import ProfileSection from "../components/profile/ProfileSection";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";

const { Title, Text } = Typography;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("personalInfo");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useSelector((state) => state.user.user, (prev, next) => prev === next);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm] = Form.useForm();

  const dispatch = useDispatch();

  if (loading || !user) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
      <>
        <div className="flex justify-center h-screen mt-3">
          <Spin indicator={antIcon} />
        </div>
      </>
    );
  }



  const showEditInfoModal = () => {
    setIsModalVisible(true);
  };

  const handleSave = async (updatedData) => {
    

    const fetchUpdateProfile = async (data) => {
      setLoading(true);
      const response = await fetchWithAuth(summaryApi.updateProfile.url, {
        method: summaryApi.updateProfile.method,
        body: JSON.stringify({
          Name: data.name,
          Phone: data.phone
        }),
      });
      const updateRespData = await response.json();
      if (updateRespData.respCode === "000") {
        return updateRespData.data;
      } else {
        console.log("Loi fetchUpdateProfile:", updateRespData);
        return null;
      }
    }

    const respData = await fetchUpdateProfile(updatedData);

    if (respData) {
      dispatch(setUser(respData));
    }
    setLoading(false);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    passwordForm.validateFields()
      .then(async (values) => {
        const { oldPassword, newPassword, confirmPassword } = values;

        if (newPassword === confirmPassword) {
          try {
            const changePasswordResponse = await fetchWithAuth(
              summaryApi.updatePasswordWithOldPassword.url,
              {
                method: summaryApi.updatePasswordWithOldPassword.method,
                body: JSON.stringify({
                  old_password: oldPassword,
                  new_password: newPassword,
                  confirm_password: confirmPassword
                }),
              }
            );

            const changePassResult = await changePasswordResponse.json();

            if (changePassResult.respCode === "000") {
              toast.success(changePassResult.data);
              setShowPasswordModal(false);
              passwordForm.resetFields();

            }
            else {
              toast.error(changePassResult.data);
            }
          } catch (error) {
            toast.error(error);
          }
        }
        else {
          toast.error("Confirm Password không đúng");
        }

      })
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "personalInfo":
        return (
          <div>
            <div >
              <Button
                type="primary"
                className="mr-6 mt-2 float-right"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </div>
            {/* Right Content */}
            <section className="lg:col-span-3 space-y-6">
              {/* Account Info */}

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex mt-4 items-center justify-between">
                  <Title level={3}>Account info</Title>
                  <Button type="link" icon={<EditOutlined />} className="text-gray-500"
                    onClick={() => showEditInfoModal()}
                  >
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-gray-100 rounded-lg flex items-center">
                    <FiUser className="mr-4 text-xl" />
                    <div>
                      <Text className="block">Name</Text>
                      <Text>{user.name}</Text>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg flex items-center">
                    <FiMail className="mr-4 text-xl" />
                    <div>
                      <Text className="block">Email Address</Text>
                      <Text>{user.email}</Text>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg flex items-center">
                    <FiPhone className="mr-4 text-xl" />
                    <div>
                      <Text className="block">Phone number</Text>
                      <Text>{user.phone}</Text>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-lg flex items-center">
                    <FiKey className="mr-4 text-xl" />
                    <div>
                      <Text className="block">Password</Text>
                      <Text>•••••••••••••••••••••</Text>
                    </div>
                  </div>

                </div>
              </div>

              {/* Lists */}
              <Wishlist  />
            </section>
            {/* Modal for changing password */}
            <Modal
              open={showPasswordModal}
              title="Change Password"
              onCancel={() => setShowPasswordModal(false)}
              onOk={handlePasswordSave}
              okText="Save"
            >
              <Form form={passwordForm} layout="vertical">
                <Form.Item
                  label="Mật khẩu hiện tại"
                  name="oldPassword"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu hiện tại của bạn" },
                  ]}
                >
                  <PasswordInput
                    placeholder="Nhập mật khẩu hiện tại"
                    name="oldPassword"
                    setErrors={(value) => passwordForm.setFields([{ name: "oldPassword", errors: value ? ["Invalid password"] : [] }])}
                    onChange={(e) => passwordForm.setFieldValue("oldPassword", e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu mới"
                  name="newPassword"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới" },
                  ]}
                >
                  <PasswordInput
                    placeholder="Nhập mật khẩu mới"
                    name="newPassword"
                    setErrors={(value) => passwordForm.setFields([{ name: "newPassword", errors: value ? ["Invalid password"] : [] }])}
                    onChange={(e) => passwordForm.setFieldValue("newPassword", e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                      },
                    }),
                  ]}
                >
                  <PasswordInput
                    placeholder="Xác nhận mật khẩu"
                    name="confirmPassword"
                    setErrors={(value) => passwordForm.setFields([{ name: "confirmPassword", errors: value ? ["Invalid password"] : [] }])}
                    onChange={(e) => passwordForm.setFieldValue("confirmPassword", e.target.value)}
                  />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        );
      case "addresses":
        return (
          <>
            <Address  />
          </>
        );
      case "communications":
        return (
          <div>
            <Title level={3}>Communications & Privacy</Title>
            <p>Adjust your communication preferences here.</p>
          </div>
        );
      case "orderHistory":
        return (
          <div>
            <OrderHistory />
          </div>
        );
      default:
        return <div>Content not found.</div>;
    }
  };

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
        <ProfileSection />
        <Title level={5}>Manage Account</Title>
        <List
          itemLayout="horizontal"
          dataSource={[
            { key: "personalInfo", title: "Personal info", icon: <UserOutlined className="text-2xl " /> },
            { key: "addresses", title: "Addresses", icon: <FiHome className="text-2xl " /> },

          ]}
          renderItem={(item) => (
            <List.Item
              onClick={() => setSelectedMenu(item.key)}
              className={`cursor-pointer my-2 p-2 rounded-lg transition-all duration-300 ${selectedMenu === item.key ? "bg-gray-200" : "bg-white"}`}
            >
              <List.Item.Meta avatar={<div className="pl-2">{item.icon}</div>} title={item.title} />
            </List.Item>
          )}
          className="mb-6"
        />

        <Title level={5}>My Orders</Title>
        <List
          itemLayout="horizontal"
          dataSource={[
            { key: "orderHistory", title: "Order History", icon: <FiGift className="text-2xl" /> },
          ]}
          renderItem={(item) => (
            <List.Item
              onClick={() => setSelectedMenu(item.key)}
              className={`cursor-pointer p-2 rounded-lg transition-all duration-300 ${selectedMenu === item.key ? "bg-gray-200" : "bg-white"}`}
            >
              <List.Item.Meta avatar={<div className="pl-2">{item.icon}</div>} title={item.title} />

            </List.Item>
          )}
          className="mb-6"
        />

       
      </aside>


      {/* Right Content */}
      <section className="lg:col-span-3 space-y-6 lg:ml-6 rounded-lg">
        {renderContent()}
      </section>
      <Info
        visible={isModalVisible}
        data={user}
        onClose={handleClose}
        onSave={handleSave}
      />
    </div>
  );
};

export default Profile;
