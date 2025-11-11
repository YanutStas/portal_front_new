import React, { useState } from "react";
import { Divider, Drawer, Flex, theme } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import MarkDownText from "../MarkDownText/MarkDownText";
import styles from "./divider.module.css";
import WrapperComponent from "./WrapperComponent";

function DividerForm({
  name = "name",
  label,
  fullDescription = false,
  variant = "solid",
  dashed = false,
  type = "horizontal",
  orientation = "center",
  span = false,
  dependOf = false,
  howDepend = false,
  stylesField_key = false,
  read = false
}) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { token } = theme.useToken();
  const dividerWrapColor = token.colorBorder;
  const showDrawer = () => setDrawerVisible(true);
  const onClose = () => setDrawerVisible(false);

  let formElement = <></>;
  if (fullDescription !== false) {
    formElement = (
      <>
        <Divider
          style={{
            borderColor: token.dividerWrapColor,
            margin: 0,
          }}
          className={styles.divider}
          dashed={dashed}
          variant={variant}
          type={type}
          orientation={orientation}
          orientationMargin="0"
        >
          {label}
          <InfoCircleOutlined
            onClick={showDrawer}
            style={{ marginLeft: 10, color: "rgba(0, 0, 0, 0.45)" }}
          />
        </Divider>
        <Drawer
          title={label}
          placement="right"
          onClose={onClose}
          open={drawerVisible}
        >
          <MarkDownText>{fullDescription}</MarkDownText>
        </Drawer>
      </>
    );
  } else {
    formElement = (
      <Flex style={{ width: "100%" }} align="center" justify="space-between">
        {!orientation === "left" && (
          <div
            className={styles.dividerWrap}
            style={{ backgroundColor: dividerWrapColor }}
          ></div>
        )}
        {label && (
          <div
            className={styles.dividerTitle}
            style={{
              paddingLeft: orientation === "left" ? 0 : false,
              textAlign: orientation === "left" ? "left" : "center",

            }}
          >
            {label}
          </div>
        )}
        <div
          className={styles.dividerWrap}
          style={{ backgroundColor: dividerWrapColor }}
        ></div>
      </Flex>
    );
  }

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

export default DividerForm;
