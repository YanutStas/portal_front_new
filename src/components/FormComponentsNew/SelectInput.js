import React from "react";
import { Form, Select, Typography } from "antd";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";
import useServices from "../../stores/useServices";

export default function SelectInput({
  name = "name",
  label = "",
  defaultValue = false,
  required = false,
  Ref_Key = false,
  dependOf = false,
  howDepend = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
}) {
  const serviceItem = useServices((state) => state.serviceItem);
  const options = serviceItem.links[Ref_Key]?.options;

  const formElement = (
    <Form.Item
      name={name}
      label={
        fullDescription ? (
          <InfoDrawer fullDescription={fullDescription}>{label}</InfoDrawer>
        ) : (
          label
        )
      }
      rules={[
        {
          required: required,
          message: "Это поле обязательное",
        },
      ]}
      style={{ maxWidth: "100%", overflow: "hidden" }}
      initialValue={defaultValue}
    >
      <Select      
        style={{ width: "100%" }}
        showSearch
        optionFilterProp="label"
        options={options}
        optionRender={(option) => {
          return (
            <Typography.Paragraph
              style={{ width: "100%", whiteSpace: "pre-wrap", marginBottom: 5 }}
            >
              {option.label}
            </Typography.Paragraph>
          );
        }}
      />
    </Form.Item>
  );

  return (
    <WrapperComponent
      span={span}
      stylesField_key={stylesField_key}
      dependOf={dependOf}
      howDepend={howDepend}
      name={name}
    >
      {formElement}
    </WrapperComponent>
  );
}
