import React, { useEffect } from "react";
import { Form, Radio, Select, Typography } from "antd";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";
import useServices from "../../stores/useServices";
import useClaims from "../../stores/Cabinet/useClaims";
import useDataForForm from "../../stores/Cabinet/useDataForForm";
import useGlobal from "../../stores/useGlobal";

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
  read = false,
  mode = false
  // options = false
}) {
  // console.log("selectInput read", read);
  const testData = useGlobal((state) => state.testData)
  const form = Form.useFormInstance();

  const { links } = useDataForForm((state) => state)
  // const serviceItem = useServices((state) => state.serviceItem);
  // const claim = useClaims((state) => state.claim);
  let options = false
  // console.log(links);

  if (links) {
    options = links[Ref_Key]?.options;
  }
  useEffect(() => {
    if (testData) {
      options && form.setFieldValue(name, options[0].value)
    }
  }, [testData])
  // else {
  //   options = read ? claim?.template.portalFields.links[Ref_Key]?.options : serviceItem?.links[Ref_Key]?.options;
  // }

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
      {(mode === "radioHorizontal" || mode === "radioVertical") &&
        <Radio.Group
          options={options}
          style={{
            display: "flex",
            flexDirection: mode === "radioVertical" ? "column" : "row",
            flexWrap:"wrap",
            gap: 8,
          }}
        />
      }
      {(mode !== "radioHorizontal" || mode !== "radioVertical") &&
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
      }
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
