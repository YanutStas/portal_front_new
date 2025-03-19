import React, { useState, useEffect, useRef } from "react";
import { Input, Button, List, theme } from "antd";
import styles from "./ChatComponent.module.css";
import moment from "moment";
import "moment/locale/ru";
import { SendOutlined } from "@ant-design/icons";

const { useToken } = theme;

export default function ChatComponent({
  statuses,
  currentStatusIndex,
}) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesContainerRef = useRef(null);

  // Получаем все токены темы
  const { token } = useToken();

  // Функция для прокрутки до последнего сообщения
  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth", // Плавная прокрутка
      });
    }
  };

  // Используем useEffect для вызова scrollToBottom при добавлении новых сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Инициализируем сообщения на основе статусов
  useEffect(() => {
    // Создаем сообщения из статусов
    const initialMessages = statuses
      .slice(0, currentStatusIndex + 1)
      .map((status, index) => ({
        sender: "system",
        text: `Статус заявки обновлен: ${status}`,
        timestamp: moment()
          .subtract(currentStatusIndex - index, "days")
          .toDate(), // Для примера используем дату
      }));
    setMessages(initialMessages);
  }, [statuses, currentStatusIndex]);

  // Функция для отправки обращения
  const handleSendRequest = async () => {
    if (userInput.trim() === "") return;
    setSendingMessage(true);
    try {
      // Здесь реализуйте отправку обращения на бэкенд
      // Для демонстрации просто добавим сообщение в чат
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userInput, timestamp: new Date() },
      ]);
      setUserInput("");
    } catch (error) {
      console.error("Ошибка при отправке обращения:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div
        ref={messagesContainerRef}
        className={styles.messagesContainer}
        style={{
          backgroundColor: token.colorBgLayout,
        }}
      >
        <List
          dataSource={messages}
          locale={{ emptyText: "У вас пока нет сообщений" }}
          renderItem={(item) => (
            <List.Item
              style={{
                justifyContent:
                  item.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  backgroundColor:
                    item.sender === "user"
                      ? token.colorPrimary
                      : token.colorBgContainer,
                  color:
                    item.sender === "user"
                      ? token.colorTextLightSolid
                      : token.colorText,
                  padding: "8px 12px",
                  borderRadius: "16px",
                  maxWidth: "70%",
                }}
              >
                <div>{item.text}</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: token.colorTextSecondary,
                    textAlign: "right",
                    marginTop: "4px",
                  }}
                >
                  {moment(item.timestamp).format("DD.MM.YYYY HH:mm")}
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        <Input.TextArea
          placeholder="Введите ваше обращение"
          rows={2}
          disabled={sendingMessage}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendRequest}
          loading={sendingMessage}
        >
          Отправить обращение
        </Button>
      </div>
    </div>
  );
}
