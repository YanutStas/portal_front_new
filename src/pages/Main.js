import React from "react";
import AppHelmet from "../components/Global/AppHelmet";
import { Flex, Typography } from "antd";
import { Anime } from "../components/Main/Anime";
const { Title } = Typography;

export default function Main() {
  return (
    <>
      <AppHelmet
        title={"Портал цифровых услуг"}
        desc={"Портал цифровых услуг АО Мособлэнерго"}
      />
      <div>
        <Title level={1}></Title>
        <Flex
          vertical
          justify="center"
          align="center"
          style={{ width: "100%", height: "calc(100vh - 335px)" }}
        >
          <Anime />
        </Flex>
      </div>
    </>
  );
}
