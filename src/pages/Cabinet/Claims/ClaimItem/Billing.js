import { Button, Divider, Typography } from "antd";
import React, { useState } from "react";
import Law from "../../../../components/Documentation/Law";
import FileForDownload from "../../../../components/FileForDownload";
import axios from "axios";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
const docsBilling = [
  {
    type: "pdf",
    name: "Счет",
    url: "/uploads/123.pdf",
    size: "3343",
  },
  {
    type: "pdf",
    name: "Счет фактура",
    url: "/uploads/124.pdf",
    size: "2343",
  },
  {
    type: "pdf",
    name: "Акт выполненых работ",
    url: "/uploads/1255.pdf",
    size: "343",
  },
];
export default function Billing({ zakaz }) {
  // const [countPay, setCountPay] = useState(0)
  const [isPay, setIsPay] = useState(false);
  // console.log(zakaz);

  const handlerPay = () => {
    setIsPay(true);
    axios
      .post(
        `${backServer}/api/cabinet/pay`,
        {
          zakaz: zakaz,
          amount: "10",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setIsPay(false);

        if (res.data?.status === "ok") {
          console.log(res.data.formUrl);
          window.open(res.data.formUrl, "_blank");
        }
      })
      .catch((err) => {
        setIsPay(false);
      });
  };
  return (
    <div>
      <Typography.Title level={4}>
        Сумма оплаты по договору: 10 руб
      </Typography.Title>
      <Button type="primary" disabled={isPay} onClick={handlerPay}>
        Оплатить картой
      </Button>
      <Divider />
      {docsBilling.map((item, index) => (
        <FileForDownload
          key={index}
          type={item.type}
          name={item.name}
          url={item.url}
          size={item.size}
        />
      ))}
    </div>
  );
}
