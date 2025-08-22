import { Form, theme } from "antd";

export default function TableResults({
  typeTotal = false,
  table = false,
  field = false,
  label = false,
}) {
  const token = theme.useToken().token;
  const fieldValue = Form.useWatch(table);
  let value = 0;
  let name = "";
  if (typeTotal === "sum") {
    name = "сумма";
    value = fieldValue?.reduce((sum, current) => {
      if (current) {
        return Number(sum) + Number(current[field]);
      }
    }, 0);
  } else if (typeTotal === "count") {
    name = "количество";
    value = fieldValue?.length;
  } else if (typeTotal === "average") {
    name = "среднее";
    value = fieldValue?.reduce((sum, current) => {
      if (current) {
        return sum + current[field];
      }
    }, 0);
    value = value / fieldValue?.length;
  } else if (typeTotal === "min") {
    name = "мин.";
    Math.min(...fieldValue.map((item) => item[field]));
  } else if (typeTotal === "max") {
    name = "макс.";
    Math.max(...fieldValue.map((item) => item[field]));
  }

  return (
    <div style={{ color: token.colorText, fontWeight: 700 }}>
      {label} ({name}):{" "}
      <span style={{ color: token.colorPrimary }}>{value}</span>{" "}
    </div>
  );
}
