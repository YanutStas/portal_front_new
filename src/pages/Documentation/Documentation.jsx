import React from "react";
import { Typography, Tabs } from "antd";
import { useSearchParams } from "react-router-dom"; 
import Law from "../../components/Documentation/Law";
import AppHelmet from "../../components/Global/AppHelmet";
import Container from "../../components/Container";
import PoliciesAndRegulations from "../../components/Documentation/PoliciesAndRegulations";
import UserGuide from "../../components/Documentation/UserGuide";
import styles from "./Documentation.module.css";
import QuickAnswers from "../../components/Answers/QuickAnswers";

// const onChange = (key) => {
//   console.log(key);
// };

export default function Documentation() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "1"; 

  const items = [
    {
      key: "1",
      label: "Вопрос - Ответ",
      children: <QuickAnswers />,
    },
    {
      key: "2",
      label: "Руководство пользователя",
      children: <UserGuide />,
    },
    {
      key: "3",
      label: "Законодательство",
      children: <Law />,
    },
    {
      key: "4",
      label: "Локальные нормативные акты",
      children: <PoliciesAndRegulations />,
    },
  ];

  return (
    <>
      <AppHelmet
        title={"Информация"}
        desc={"Портал цифровых услуг АО Мособлэнерго - Информация"}
      />
      <Container>
        <Typography.Title level={1} className={styles.title}>
          Информация
        </Typography.Title>
        <div style={{ margin: "0 auto" }} className={styles.content}>
          <Tabs
            style={{ maxWidth: "80vw" }}
            defaultActiveKey={defaultTab}
            items={items}
            // onChange={onChange}
          />
        </div>
      </Container>
    </>
  );
}
