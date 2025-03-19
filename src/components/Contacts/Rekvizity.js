import React from "react";
import { Typography, Card, message, theme } from "antd";
import { CopyOutlined } from "@ant-design/icons";

export default function Rekvizity() {
  const handleCopy = (fieldName) => {
    message.success(`${fieldName} скопирован`);
  };
  const { token } = theme.useToken();

  return (
    <Card title={"Реквизиты"} style={{ height: "100%" }}>
      <Typography.Title
        level={5}
        style={{ marginTop: 0, color: token.colorInfo }}
      >
        Основные реквизиты
      </Typography.Title>
      <p>
        <b>ИНН: </b>
        <Typography.Text
          copyable={{
            text: "5032137342",
            tooltips: ["Скопировать ИНН", "ИНН скопирован"],
            icon: <CopyOutlined />,
            onCopy: () => handleCopy("ИНН"),
          }}
        >
          5032137342
        </Typography.Text>
      </p>
      <p>
        <b>КПП: </b>
        <Typography.Text
          copyable={{
            text: "502401001",
            tooltips: ["Скопировать КПП", "КПП скопирован"],
            icon: <CopyOutlined />,
            onCopy: () => handleCopy("КПП"),
          }}
        >
          502401001
        </Typography.Text>
      </p>
      <p>
        <b>ОГРН: </b>
        <Typography.Text
          copyable={{
            text: "1055006353478",
            tooltips: ["Скопировать ОГРН", "ОГРН скопирован"],
            icon: <CopyOutlined />,
            onCopy: () => handleCopy("ОГРН"),
          }}
        >
          1055006353478
        </Typography.Text>
      </p>
      <p>
        <b>ОКПО: </b> 78100576,<b>ОКТМО: </b> 46628101
        {/* Если хотите отдельное копирование для ОКПО и ОКТМО */}
      </p>
      <p>
        <b>Р/с: </b>
        <Typography.Text
          copyable={{
            text: "40702810492000006024",
            tooltips: ["Скопировать Р/с", "Р/с скопирован"],
            icon: <CopyOutlined />,
            onCopy: () => handleCopy("Р/с"),
          }}
        >
          40702810492000006024
        </Typography.Text>{" "}
        в Банк ГПБ (АО) г. Москва
      </p>
      <p>
        <b>К/с: </b>
        <Typography.Text
          copyable={{
            text: "30101810200000000823",
            tooltips: ["Скопировать К/с", "К/с скопирован"],
            icon: <CopyOutlined />,
            onCopy: () => handleCopy("К/с"),
          }}
        >
          30101810200000000823
        </Typography.Text>
      </p>
      <p>
        <b>БИК: </b>
        <Typography.Text
          copyable={{
            text: "044525823",
            tooltips: ["Скопировать БИК", "БИК скопирован"],
            icon: <CopyOutlined />,
            onCopy: () => handleCopy("БИК"),
          }}
        >
          044525823
        </Typography.Text>
      </p>

      {/* ---------------------------------------------------------------------------------------------------------------------------- */}

      <Typography.Title
        level={5}
        style={{ marginTop: 20, color: token.colorPrimary }}
      >
        Для департамента технологических присоединений
      </Typography.Title>

      <p>
        <b>Р/сч: </b>
        <Typography.Text
          copyable={{
            text: "40602810500760000043",
            tooltips: ["Скопировать Р/сч", "Р/сч скопирован"],
            icon: <CopyOutlined />,
            onCopy: () => handleCopy("Р/сч"),
          }}
        >
          40602810500760000043
        </Typography.Text>
      </p>
      <p>ФИЛИАЛ "ЦЕНТРАЛЬНЫЙ" БАНКА ВТБ (ПАО) Г. МОСКВА</p>
      <p>
        <b>Кор/сч: </b>
        <Typography.Text
          copyable={{
            text: "30101810145250000411",
            tooltips: ["Скопировать Кор/сч", "Кор/сч скопирован"],
            icon: <CopyOutlined />,
            onCopy: () => handleCopy("Кор/сч"),
          }}
        >
          30101810145250000411
        </Typography.Text>
      </p>
      <p>
        <b>БИК: </b>
        <Typography.Text
          copyable={{
            text: "044525411",
            tooltips: ["Скопировать БИК", "БИК скопирован"],
            icon: <CopyOutlined />,
            onCopy: () => handleCopy("БИК"),
          }}
        >
          044525411
        </Typography.Text>
      </p>
    </Card>
  );
}
