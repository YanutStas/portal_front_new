import React from "react";
import { Form, Select, Table, Tooltip, Slider, InputNumber } from "antd";
import styles from "./Calc.module.css";
import calcData from "./calcData.json";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const CalcTable = ({ dataSource, calculatedData, onValuesChange }) => {
  const renderColumns = [
    {
      title: "Название электрооборудования",
      dataIndex: "name",
      key: "name",
      width: "20%",
      render: (text, record) =>
        record.isSection ? (
          <strong className={styles.sectionHeader}>{record.section}</strong>
        ) : (
          <Tooltip title={record.description || ""}>
            <span className={styles.columnHeader}>
              {text}
              {record.description && (
                <InfoCircleOutlined className={styles.tooltipIcon} />
              )}
            </span>
          </Tooltip>
        ),
    },
    ...calcData.columns.map((column) => ({
      title: (
        <span className={styles.columnHeader}>
          {column.title}
          <Tooltip title={column.tooltip}>
            <InfoCircleOutlined className={styles.tooltipIcon} />
          </Tooltip>
        </span>
      ),
      dataIndex: column.dataIndex,
      key: column.dataIndex,
      width: column.width || "16%",
      render: (_, record) => {
        if (record.isSection) return null;
        if (column.dataIndex === "unit") {
          return record.fixedUnit ? (
            <span>{record.unit}</span>
          ) : (
            <Form.Item
              name={[record.key, "unit"]}
              initialValue={record.unit || "Штук"}
              noStyle
            >
              <Select popupMatchSelectWidth={false} onChange={onValuesChange}>
                {column.options.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        }
        if (column.dataIndex === "usageCoefficient") {
          return (
            <Form.Item
              name={[record.key, column.dataIndex]}
              initialValue={record[column.dataIndex] || column.defaultValue}
              noStyle
            >
              <Slider
                min={0}
                max={1}
                step={0.1}
                onChange={onValuesChange}
                marks={{ 0: "0", 1: "1" }}
                tooltip={{
                  open: true,
                }}
              />
            </Form.Item>
          );
        }
        if (column.dataIndex === "count") {
          return (
            <Form.Item
              name={[record.key, column.dataIndex]}
              initialValue={record[column.dataIndex] || column.defaultValue}
              noStyle
            >
              <InputNumber
                min={0}
                step={1}
                precision={0}
                onChange={onValuesChange}
              />
            </Form.Item>
          );
        }
        if (column.type === "number") {
          return (
            <Form.Item
              name={[record.key, column.dataIndex]}
              initialValue={record[column.dataIndex] || column.defaultValue}
              noStyle
            >
              <InputNumber
                min={0}
                step={0.01}
                stringMode
                onChange={onValuesChange}
              />
            </Form.Item>
          );
        }
        if (column.dataIndex === "consumedPower") {
          return (
            <span>{calculatedData[record.key]?.consumedPower || "0.00"}</span>
          );
        }
        return null;
      },
    })),
  ];

  return (
    <Table
      columns={renderColumns}
      dataSource={dataSource}
      pagination={false}
      locale={{ emptyText: "Нет данных" }}
      className={styles.table}
    />
  );
};

export default CalcTable;

