import React, { useEffect } from "react";
import { Modal, Form, Input, message } from "antd";

const Info = ({ visible, data, onClose, onSave }) => {
  const [form] = Form.useForm();


  useEffect(() => {
    if (data) {
      const defaultData = {
        name: data.name || "",
        phone: data.phone || "",
      };
      form.setFieldsValue(defaultData);
    }
  }, [data, form]);

  const handleSave = () => {
    
    form.validateFields()
      .then((values) => {
        onSave(values);
        onClose();
      })
      .catch (() => {
        message.info("Bạn phải nhập đầy đủ thông tin ")
        return;
      })
      
  };

  

  return (
    <>
      <Modal
        open={visible}
        title="Edit Account Info"
        onCancel={onClose}
        onOk={handleSave}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Your Name"
            name="name"
            rules={[
              { required: true, message: "Please enter your name" },
            ]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
              {
                pattern: /^[0-9]{10,11}$/, 
                message: "Phone number must be 10-11 digits",
              },
            ]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

        </Form>
      </Modal>

      
    </>
  );
};

export default Info;
