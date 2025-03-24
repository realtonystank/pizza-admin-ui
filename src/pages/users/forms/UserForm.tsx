import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import { Tenant } from "../../../types";

const UserForm = () => {
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        perPage: 100000,
        currentPage: 1,
      } as unknown as Record<string, string>).toString();
      const response = await getTenants(queryString);
      return response.data;
    },
  });

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" style={{ width: "100%" }} size={"large"}>
          <Card title={"Basic info"}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label={"First name"}
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "First name is required",
                    },
                  ]}
                >
                  <Input size={"large"} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Last name"}
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Last name is required",
                    },
                  ]}
                >
                  <Input size={"large"} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label={"Email"}
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Email is required",
                    },
                    {
                      type: "email",
                      message: "Invalid email",
                    },
                  ]}
                >
                  <Input size={"large"} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title={"Security info"}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label={"Password"}
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Password is required",
                    },
                  ]}
                >
                  <Input.Password size={"large"} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title={"Role"}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label={"Role"}
                  name="role"
                  rules={[
                    {
                      required: true,
                      message: "Role is required",
                    },
                  ]}
                >
                  <Select
                    size={"large"}
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder={"Select Role"}
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="manager">Manager</Select.Option>
                    <Select.Option value="customer">Customer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Restaurant"}
                  name="tenantId"
                  rules={[
                    {
                      required: true,
                      message: "Restaurant is required",
                    },
                  ]}
                >
                  <Select
                    size={"large"}
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder={"Select Restaurant"}
                  >
                    {tenants?.data?.map((tenant: Tenant) => {
                      return (
                        <Select.Option value={tenant.id} key={tenant.id}>
                          {tenant.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;
