import React, { useState } from "react";
import { Drawer, theme } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import MarkDownText from "./MarkDownText/MarkDownText";

const InfoDrawer = ({ fullDescription, children: label }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const showDrawer = () => setDrawerVisible(true);
  const onClose = () => setDrawerVisible(false);

  const { token } = theme.useToken()
// console.log(token);

  return (
    <>
      {label}
      <InfoCircleOutlined
        onClick={showDrawer}
        style={{
          color: token.colorInfoText,
          transform: "translate(3px, 0px)",
        }}
      />
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
};

export default InfoDrawer;
