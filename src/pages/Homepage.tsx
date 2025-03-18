import { Card, Col, Row, Space, Statistic, Table, Typography } from "antd";
import { useAuthStore } from "../../store";
import { BarChartIcon } from "../components/icons/BarChart";
import Icon from "@ant-design/icons";
import GiftIcon from "../components/icons/GiftIcon";
const { Title } = Typography;

const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street",
  },
  {
    key: "2",
    name: "John",
    age: 42,
    address: "10 Downing Street",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

function Homepage() {
  const { user } = useAuthStore();

  return (
    <div>
      <Title level={4}>Welcome, {user?.firstName} 😄</Title>
      <Row gutter={30} justify="space-between">
        <Col span={12} style={{ padding: "20px" }}>
          <Row gutter={20} justify="center">
            <Col span={12}>
              <Card>
                <Statistic
                  title={
                    <Space>
                      <Icon
                        component={GiftIcon}
                        style={{
                          color: "green",
                          background: "lightgreen",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography.Text style={{ fontWeight: "bold" }}>
                        Total orders
                      </Typography.Text>
                    </Space>
                  }
                  value={28}
                  valueStyle={{
                    paddingLeft: "20px",
                    fontWeight: "bold",
                    fontSize: "26px",
                  }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title={
                    <Space>
                      <Icon
                        component={BarChartIcon}
                        style={{
                          color: "#6495ED",
                          background: "azure",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography.Text style={{ fontWeight: "bold" }}>
                        Total sale
                      </Typography.Text>
                    </Space>
                  }
                  prefix={"₹"}
                  value={50000}
                  valueStyle={{
                    paddingLeft: "20px",
                    fontWeight: "bold",
                    fontSize: "26px",
                  }}
                />
              </Card>
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Col span={24}>
              <Card
                title={
                  <>
                    <Icon component={BarChartIcon} /> Sales
                  </>
                }
              >
                <p>Content</p>
                <p>Content</p>
                <p>Content</p>
                <p>Content</p>
                <p>Content</p>
                <p>Content</p>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={12} style={{ padding: "20px" }}>
          <Card
            title={
              <>
                <Icon
                  component={GiftIcon}
                  style={{
                    color: "#F65F42",
                    background: "#fcc1b6",
                    borderRadius: "50%",
                  }}
                />{" "}
                Recent Orders
              </>
            }
            style={{ height: "100%" }}
          >
            <Table dataSource={dataSource} columns={columns} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Homepage;
