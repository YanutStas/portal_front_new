import { InfoCircleOutlined } from "@ant-design/icons";
import { List, Avatar, Space, Popover, theme } from "antd";
import React from "react";
import StrapiRichText from "../StrapiRichText";

export default function ListDocs({ list }) {
  const { customfontSizeIcon, colorBorder } = theme.useToken().token;
  return (
    <List
      itemLayout="horizontal"
      dataSource={list}
      renderItem={(item, index) => (
        <List.Item key={index}>
          <List.Item.Meta
            avatar={
              <Avatar
                src={`https://cdn-icons-png.flaticon.com/512/281/281760.png`}
                shape="square"
              />
            }
            title={
              <>
                {item.displayName}{" "}
                {item.common.description ? (
                  <Popover
                    content={
                      <StrapiRichText content={item.common.description} />
                    }
                  >
                    <InfoCircleOutlined
                      style={{
                        color: colorBorder,
                        fontSize: customfontSizeIcon,
                        cursor: "pointer",
                      }}
                    />
                  </Popover>
                ) : (
                  false
                )}
              </>
            }
            description={<Space>{item.common.shortDescription}</Space>}
          />
        </List.Item>
      )}
    />
  );
}
