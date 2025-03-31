import { Card, Col, Form, Radio, Row, Switch } from "antd";
import { Attribute, Category } from "../../../types";

type AttributeProps = {
  selectedCategoryString: string;
};

const Attributes = ({ selectedCategoryString }: AttributeProps) => {
  const selectedCategory = selectedCategoryString
    ? (JSON.parse(selectedCategoryString) as Category)
    : null;

  if (!selectedCategory) return null;

  return (
    <Card title={"Attributes"}>
      {selectedCategory?.attributes.map((attribute: Attribute) => {
        return (
          <div key={attribute.name}>
            {attribute.widgetType === "radio" ? (
              <Form.Item
                label={attribute.name}
                name={["attributes", attribute.name]}
                initialValue={attribute.defaultValue}
                rules={[
                  { required: true, message: `${attribute.name} is required.` },
                ]}
              >
                <Radio.Group>
                  {attribute.availableOptions.map((option: string) => {
                    return (
                      <Radio.Button value={option} key={option}>
                        {option}
                      </Radio.Button>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            ) : attribute.widgetType === "switch" ? (
              <Row>
                <Col>
                  <Form.Item
                    label={attribute.name}
                    name={["attributes", attribute.name]}
                    valuePropName="checked"
                    initialValue={attribute.defaultValue}
                  >
                    <Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
          </div>
        );
      })}
    </Card>
  );
};

export default Attributes;
