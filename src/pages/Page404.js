import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Page404() {
  const navigator = useNavigate();
  const handlerGoHome = () => {
    navigator("/");
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Извините, но такой страницы не существует"
      extra={
        <Button type="primary" onClick={handlerGoHome}>
          На главную
        </Button>
      }
    />
  );
}
