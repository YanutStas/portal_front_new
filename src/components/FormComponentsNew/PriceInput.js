import React, { useEffect } from "react";
import { Form, Input, theme } from "antd";
import axios from "axios";
import useTemp from "../../stores/Cabinet/useTemp";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

export default function PriceInput({
  name = "name",
  label = "",
  dependOf = false,
  howDepend = false,
  properties = false,
  priceType = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
}) {
  const { colorTextHeading } = theme.useToken().token;

  const currency = useTemp((state) => state.currency);
  const setCurrency = useTemp((state) => state.setCurrency);

  const form = Form.useFormInstance();
  let objectProp = null;
  if (properties) objectProp = properties;
  Form.useWatch(objectProp["ТипЦены"], form);
  let typePrice = form.getFieldValue(objectProp["ТипЦены"]);

  if (priceType && priceType !== "00000000-0000-0000-0000-000000000000") {
    typePrice = priceType.Ref_Key;
  }

  let nomenclature = Form.useWatch(objectProp["price"]["Номенклатура"], form);
  useEffect(() => {
    if (typePrice && nomenclature) {
      axios
        .get(
          `${backServer}/api/cabinet/get-price/${typePrice}/${nomenclature}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data) {
            setCurrency({ [name]: res.data.currency });
            form.setFieldValue(name, res.data.price);
          } else {
            form.setFieldValue(name, NaN);
          }
        });
    }
  }, [typePrice, nomenclature]);
  Form.useWatch(dependOf, form);

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
    >
      <Input
        disabled={true}
        style={{ color: colorTextHeading, width: "inherit" }}
        suffix={currency[name]}
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
