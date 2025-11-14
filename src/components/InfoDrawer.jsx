import React, { useState } from "react";
import { Button, Drawer, theme } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import MarkDownText from "./MarkDownText/MarkDownText";

const InfoDrawer = ({ fullDescription, children: label, button = false, title = false }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const showDrawer = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDrawerVisible(true)
  };
  const onClose = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDrawerVisible(false)
  }

  const { token } = theme.useToken()
  // console.log(token);

  return (
    <>
      {!button &&
        <>
          {label}
          < InfoCircleOutlined
            onClick={showDrawer}
            style={{
              color: token.colorInfoText,
              transform: "translate(3px, 0px)",
            }}
          />
        </>
      }
      {button && <Button onClick={showDrawer}>Подробнее...</Button>}
      <Drawer
        title={label || title}
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
