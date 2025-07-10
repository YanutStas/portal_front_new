import React from "react";
import { Layout, Space, Typography, Button, Row, Col } from "antd";

import useAuth from "../../../stores/useAuth";
import styles from "./AppFooter.module.css";

import telegaIcon from "../../../img/socialMedia/telega.png";
import vkIcon from "../../../img/socialMedia/vk.png";
import okIcon from "../../../img/socialMedia/ok.png";
import yandexIcon from "../../../img/socialMedia/yandex.png";

const { Footer } = Layout;
const { Link } = Typography;

export default function AppFooter() {
  const auth = useAuth((state) => state.auth);

  return (
    <Footer
      // className={`${auth ? styles.footerContentAuth : styles.footerContent}`}
      className={ styles.footerContent}
    >
      <Space direction="vertical" size="large" align="center">
        {/* Социальные сети */}
        <Row gutter={[16, 16]} justify="center">
          <Col>
            <Button
              type="link"
              href="https://t.me/mosoblenergo"
              target="_blank"
              rel="noopener noreferrer"
              icon={
                <img
                  src={telegaIcon}
                  alt="Telegram"
                  style={{ width: 30, height: 30 }}
                />
              }
            />
          </Col>
          <Col>
            <Button
              type="link"
              href="https://vk.com/mosoblenergo"
              target="_blank"
              rel="noopener noreferrer"
              icon={
                <img src={vkIcon} alt="VK" style={{ width: 30, height: 30 }} />
              }
            />
          </Col>
          <Col>
            <Button
              type="link"
              href="https://ok.ru/mosoblenergo"
              target="_blank"
              rel="noopener noreferrer"
              icon={
                <img src={okIcon} alt="OK" style={{ width: 30, height: 30 }} />
              }
            />
          </Col>
          <Col>
            <Button
              type="link"
              href="https://dzen.ru/mosoblenergo"
              target="_blank"
              rel="noopener noreferrer"
              icon={
                <img
                  src={yandexIcon}
                  alt="Yandex"
                  style={{ width: 30, height: 30 }}
                />
              }
            />
          </Col>
        </Row>

        {/* Текущая информация о сайте */}
        <Typography.Text>
          
          <Link
            href="https://mosoblenergo.ru/"
            target="_blank"
            rel="noopener noreferrer"
          >
            АО «Мособлэнерго»
          </Link>{" "}
          | 2023 -{" "}
          {new Date().getFullYear()}
        </Typography.Text>
      </Space>
    </Footer>
  );
}
