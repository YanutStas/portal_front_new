import React from "react";
import { Form, Input, InputNumber, Table, Button } from "antd";

export default function TableInputNew({ name = "name", fields: Fields = [] }) {
  const columns = Fields.map((item, index) => ({
    title: item.label,
    dataIndex: item.name,
    key: item.name,
    render: (text) => (
      <Form.Item name={[name, item.name]}>
        <Input />
      </Form.Item>
    ),
  }));

  const data = [];
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      inputType === "number" ? (
        <InputNumber />
      ) : (
        <Input placeholder="123" style={{ width: "100%" }} />
      );
    return (
      <td {...restProps}>
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      </td>
    );
  };
  return (
    <Table
      columns={columns}
      dataSource={data}
      components={{
        body: {
          wrapper: ({ children }) => (
            <Form.List name={name}>
              {(fields, { add, remove }) => (
                <>
                  <div>{fields.map((field) => children)}</div>
                  <Button onClick={add}>Добавить</Button>
                </>
              )}
            </Form.List>
          ),
          cell: EditableCell,
        },
      }}
    />
  );
}
