import React from "react";

import { Typography } from "antd";

import AppHelmet from "../../components/Global/AppHelmet";

import QuickAnswers from "../../components/Answers/QuickAnswers";

const { Title } = Typography;

export default function Answers() {
  return (
    <div style={{ padding: "20px", maxWidth: "1600px", margin: "0 auto" }}>
      <AppHelmet title={"Вопрос - Ответ"} desc={"Часто задаваемые вопросы"} />
      <Title level={2} style={{ marginBottom: "16px" }}>
        Вопрос - Ответ
      </Title>
      <QuickAnswers />
    </div>
  );
}
