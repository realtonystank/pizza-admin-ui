import { Form, message, Space, Typography, Upload, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const ProductImage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const uploaderConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      console.log("inside before upload");
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        console.error("You can only upload JPEG/PNG file");
        messageApi.error("You can only upload JPEG/PNG image");
      }

      setImageUrl(URL.createObjectURL(file));

      return false;
    },
  };

  return (
    <Form.Item
      name={"image"}
      rules={[{ required: true, message: "Product image is required" }]}
      valuePropName={"file"}
    >
      <Upload listType="picture-card" {...uploaderConfig}>
        {contextHolder}
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          <div>
            <Space direction={"vertical"}>
              <PlusOutlined />
              <Typography.Text>Upload</Typography.Text>
            </Space>
          </div>
        )}
      </Upload>
    </Form.Item>
  );
};

export default ProductImage;
