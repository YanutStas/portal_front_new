import { Col, Form } from "antd";
import React from "react";
import useServices from "../../stores/useServices";
import useClaims from "../../stores/Cabinet/useClaims";

export default function WrapperComponent({
  children,
  dependOf = false,
  name = false,
  howDepend = false,
  stylesField_key,
  read = false
}) {
  // console.log("WrapperComponent read", read);
  // console.log("WrapperComponent name", name);
  // console.log("WrapperComponent children", children);
  const serviceItem = useServices((state) => state.serviceItem);
  const claim = useClaims((state) => state.claim);
  const styles = read ? claim?.template?.portalFields?.styles[stylesField_key] : (serviceItem?.styles && serviceItem?.styles[stylesField_key]);

  const mainForm = Form.useFormInstance();
  let fieldDepends = Form.useWatch(dependOf, mainForm);

  const formElement = (
    <Col {...styles} xxl={styles?.span ? styles.span : 24} xs={24}>
      {children}
    </Col>
  );
  if (!dependOf) return formElement;
  if (dependOf && howDepend && howDepend.options?.length > 0) {
    let show = false;
    if (typeof fieldDepends === "undefined") fieldDepends = false;
    howDepend.options.forEach((item) => {
      if (item.value === "true") item.value = true;
      if (item.value === "false") item.value = false;
      if (item.value == fieldDepends) show = true;
    });
    if (show) return formElement;
  }
  if (dependOf && howDepend && howDepend.max) {
    mainForm.setFieldValue(name, "");
    if (fieldDepends >= howDepend.min && fieldDepends <= howDepend.max)
      return formElement;
  }
}
