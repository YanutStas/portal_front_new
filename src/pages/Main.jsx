import React from "react";
import AppHelmet from "../components/Global/AppHelmet";
import { Flex, List, Typography } from "antd";
import { Anime } from "../components/Main/Anime";
import ScrollToTop from "../components/ScrollToTop";
import { Link } from "react-router-dom";
import CartOnMain from "../components/Main/CardOnMain";
const { Title, Paragraph } = Typography;


const data = [
  'Технологическое подключение.',
  'Коммерческие услуги.',
  'Сервисные услуги.',
];
export default function Main() {
  return (
    <>
      <ScrollToTop />
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
          // style={{ width: "100%", height: "calc(100vh - 335px)" }}
        >

          <Anime />
        </Flex>
        <Flex gap={20} wrap={"wrap"} justify="center">
          <CartOnMain color={"#D0DCF4"} dataList={data} url="/services" title="Каталог услуг" />
          <CartOnMain color={"#EDE8F6"} url="/calc" title="Калькулятор" text={"Калькулятор мощности"}/>
          <CartOnMain color={"#E2E8F0"} url="/docs" title="Информация" text={"Документация и законодательство"}/>
          <CartOnMain color={"#d0ecf4ff"} url="/about" title="О нас" text={"Информация о компании"}/>
          <CartOnMain color={"#f4d0d5ff"} url="/contacts" title="Контакты" text={"Контакты ЦОК и ПОК"}/>
        </Flex>
      </div>
    </>
  );
}
