import React from "react";
import { Avatar, Typography, Button, Upload, message } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import fetchWithAuth from "../../helps/fetchWithAuth";
import summaryApi from "../../common";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/userSlice";
const { Title, Text } = Typography;

const ProfileSection = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetchWithAuth(summaryApi.uploadAvatarProfile.url, {
        method: summaryApi.uploadAvatarProfile.method,
        body: formData,
      });

      const data = await response.json();

      if (data.respCode === "000") {
        message.success("Ảnh đã được tải lên thành công!");
        dispatch(setUser(data.data));
      } else {
        message.error(data.message || "Tải ảnh thất bại.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải ảnh.");
      console.error(error);
    }
  };

  return (
    <section className="text-center mb-8">
      <div className="relative inline-block">
        <Avatar
          size={100}
          src={user.profile_img !== null ? user.profile_img : null}
          icon={<UserOutlined />}
        />

        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            handleUpload(file);
            return false;
          }}
        >
          <Button
            className="absolute rounded-full top-0 left-0 w-full h-full bg-transparent text-white flex items-center justify-center   hover:bg-black  transition duration-300 "
            icon={<EditOutlined />}
          >
            Edit
          </Button>
        </Upload>
      </div>
      <Title level={4} className="mt-4">
        {user.name}
      </Title>
      {user.name && user.created_at && (
        <Text type="secondary">
          Registered:
          {new Date(user.created_at).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>

      )}

    </section>
  );
};

export default ProfileSection;
