import React from "react";
import { Typography, Card, Row, Col, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

import telImg from "../../img/contacts-icon2.svg";
import emailImg from "../../img/contacts-icon4.svg";
import mapImg from "../../img/contacts-icon1.svg";
const { Text } = Typography;

export default function ContactInfo() {
  const handleCopy = (fieldName) => {
    message.success(`${fieldName} скопирован`);
  };
  return (
    <Card title={"Контактная информация"}>
      {/* Адрес юридического лица */}
      <Row gutter={[16, 16]} align="top">
        <Col flex="40px">
          <img
            src={mapImg}
            alt="address"
            style={{ width: "40px", height: "40px" }}
          />
        </Col>
        <Col flex="1">
          <Text strong>Адрес юридического лица:</Text>
          <p>
            <Typography.Text
              copyable={{
                text: "143421 Московская область, г.о. Красногорск, автодорога Балтиятер 26 км, Бизнес-центр Рига-Ленд, стр. Б3, подъезд 3, этаж 7,помещ. 2, ком. 1",
                tooltips: [
                  "Скопировать адрес юридического лица",
                  "Адрес юридического лица скопирован",
                ],
                icon: <CopyOutlined />,
                onCopy: () => handleCopy("Адрес юридического лица"),
              }}
            >
              143421 Московская область, г.о. Красногорск, автодорога Балтия тер
              26 км, Бизнес-центр Рига-Ленд, стр. Б3, подъезд 3, этаж 7, помещ.
              2, ком. 1
            </Typography.Text>
          </p>
        </Col>
      </Row>

      {/* Адрес для корреспонденции */}
      <Row gutter={[16, 16]} align="top">
        <Col flex="40px">
          <img
            src={emailImg}
            alt="email"
            style={{ width: "40px", height: "40px" }}
          />
        </Col>
        <Col flex="1">
          <Text strong>Адрес для корреспонденции:</Text>
          <p>
            <Typography.Text
              copyable={{
                text: "143421 Московская область, Красногорский р-н, 26 км автодороги «Балтия», Бизнес Центр «Рига-Ленд», строение Б3",
                tooltips: [
                  "Скопировать адрес для корреспонденции",
                  "Адрес для корреспонденции скопирован",
                ],
                icon: <CopyOutlined />,
                onCopy: () => handleCopy("Адрес для корреспонденции"),
              }}
            >
              143421 Московская область, Красногорский р-н, 26 км автодороги
              «Балтия», Бизнес Центр «Рига-Ленд», строение Б3
            </Typography.Text>
          </p>
        </Col>
      </Row>

      {/* Телефон */}
      <Row gutter={[16, 16]} align="top">
        <Col flex="40px">
          <img
            src={telImg}
            alt="phone"
            style={{ width: "40px", height: "40px" }}
          />
        </Col>
        <Col flex="1">
          <Text strong>Телефон:</Text>
          <p>
            <b>
              <a href="tel:+74957803962" style={{ color: "#0061aa" }}>
                +7 (495) 780-39-62
              </a>
            </b>
          </p>
        </Col>
      </Row>
    </Card>
  );
}
