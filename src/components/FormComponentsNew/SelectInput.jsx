import React from "react";
import { Form, Select, Typography } from "antd";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";
import useServices from "../../stores/useServices";
import useClaims from "../../stores/Cabinet/useClaims";
import useDataForForm from "../../stores/Cabinet/useDataForForm";

export default function SelectInput({
  name = "name",
  label = "",
  placeholder = "-",
  defaultValue = undefined,
  required = false,
  Ref_Key = false,
  dependOf = false,
  howDepend = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
  read = false
}) {
  // console.log("selectInput read", read);

  const { links } = useDataForForm((state) => state)
  const serviceItem = useServices((state) => state.serviceItem);
  const claim = useClaims((state) => state.claim);
  let options = false
  // console.log(links);

  if (links) {
    options = links[Ref_Key]?.options;
  } else {
    options = read ? claim?.template.portalFields.links[Ref_Key]?.options : serviceItem?.links[Ref_Key]?.options;
  }

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
        allowClear
        style={{ width: "100%" }}
        placeholder={placeholder}
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
      read={read}
    >
      {formElement}
    </WrapperComponent>
  );
}
