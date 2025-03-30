import { Category } from "../../../types";
import { Card, Col, Row, Space, Typography, Form, InputNumber } from "antd";

type PricingProps = {
  selectedCategoryString: string;
};

const Pricing = ({ selectedCategoryString }: PricingProps) => {
  const selectedCategory = selectedCategoryString
    ? (JSON.parse(selectedCategoryString) as Category)
    : null;

  if (!selectedCategory) return null;

  return (
    <Card title={"Product price"}>
      {Object.entries(selectedCategory?.priceConfiguration).map(
        ([configKey, configValue]) => {
          return (
            <div key={configKey}>
              <Space
                direction={"vertical"}
                size={"large"}
                style={{ width: "100%" }}
              >
                <Typography.Text>
                  {configKey} {`(${configValue.priceType})`}
                </Typography.Text>
                <Row gutter={20}>
                  {configValue.availableOptions.map((option: string) => {
                    return (
                      <Col span={8} key={option}>
                        <Form.Item
                          label={option}
                          name={[
                            "priceConfiguration",
                            JSON.stringify({
                              configurationKey: configKey,
                              priceType: configValue.priceType,
                            }),
                            option,
                          ]}
                        >
                          <InputNumber addonAfter="₹" />
                        </Form.Item>
                      </Col>
                    );
                  })}
                </Row>
              </Space>
            </div>
          );
        }
      )}
    </Card>
  );
};

export default Pricing;
