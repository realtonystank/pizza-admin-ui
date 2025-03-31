import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ProductsFilter from "./ProductsFilter";
import { useForm } from "antd/es/form/Form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PER_PAGE } from "../../constants";
import { createProduct, getProducts } from "../../http/api";
import { Category, FieldData, Product } from "../../types";
import { debounce } from "lodash";
import { useAuthStore } from "../../../store";
import ProductForm from "./forms/ProductForm";
import { makeFormData } from "./forms/helpers";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: Product) => {
      return (
        <div>
          <Space>
            <Image width={60} src={record.image} preview={false} />
            <Typography.Text>{text}</Typography.Text>
          </Space>
        </div>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "isPublished",
    key: "isPublished",
    render: (_: boolean, record: Product) => {
      return (
        <>
          {record.isPublished ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="purple">Draft</Tag>
          )}
        </>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd/MM/yyyy HH:mm")}
        </Typography.Text>
      );
    },
  },
];

const Products = () => {
  const { user } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
    tenantId: user!.role === "manager" ? user!.tenant?.id : undefined,
  });
  const queryClient = useQueryClient();
  const [form] = useForm();
  const [createProductForm] = useForm();
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const {
    data: products,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: async () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();

      const products = await getProducts(queryString);
      return products.data;
    },
  });
  const deboundedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => {
        return {
          [item.name[0]]: item.value,
        };
      })
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterFields) {
      deboundedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        currentPage: 1,
      }));
    }
  };

  const { mutate: productMutation } = useMutation({
    mutationKey: ["product"],
    mutationFn: async (data: FormData) => {
      await createProduct(data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      createProductForm.resetFields();
      setDrawerOpen(false);
    },
  });

  const onHandleSubmit = async () => {
    await createProductForm.validateFields();
    const category = createProductForm.getFieldValue("category");

    const priceConfiguration =
      createProductForm.getFieldValue("priceConfiguration");
    const pricing = Object.entries(priceConfiguration).reduce(
      (acc, [key, value]) => {
        const parsedKey = JSON.parse(key);
        return {
          ...acc,
          [parsedKey.configurationKey]: {
            priceType: parsedKey.priceType,
            availableOptions: value,
          },
        };
      },
      {}
    );

    const categoryId = (JSON.parse(category) as Category)._id;

    const attributes = createProductForm.getFieldValue("attributes");

    const attr = Object.entries(attributes).map(([key, value]) => {
      return {
        name: key,
        value,
      };
    });

    const productData = {
      ...createProductForm.getFieldsValue(),
      image: createProductForm.getFieldValue("image"),
      categoryId,
      priceConfiguration: pricing,
      attributes: attr,
    };
    delete productData.category;

    const formData = makeFormData(productData);
    console.log("Formdata -> ", formData);
    productMutation(formData);
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between" style={{ minHeight: 24 }}>
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Products" },
            ]}
          />
          {isFetching && (
            <Spin
              indicator={
                <LoadingOutlined style={{ fontSize: 24 }} spin={true} />
              }
            />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>

        <Form form={form} onFieldsChange={onFilterChange}>
          <ProductsFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
              Add Product
            </Button>
          </ProductsFilter>
        </Form>
        <Table
          columns={columns}
          dataSource={products?.data}
          rowKey={"_id"}
          pagination={{
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
            total: products?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              setQueryParams((prev) => ({ ...prev, currentPage: page }));
            },
          }}
        />

        <Drawer
          title={"Add Product"}
          width={720}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          destroyOnClose={true}
          open={drawerOpen}
          onClose={() => {
            createProductForm.resetFields();
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  createProductForm.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form form={createProductForm} layout="vertical">
            <ProductForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Products;
