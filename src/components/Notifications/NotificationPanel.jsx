import React from "react";
import { Timeline, Typography, Button, Space } from "antd";
import { NotificationOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useNotifications from "../../stores/useNotifications";
import useAuth from "../../stores/useAuth"; 

const { Text } = Typography;

const NotificationPanel = () => {
  const { notifications } = useNotifications();
  const { auth } = useAuth(); 

  if (!auth) {
    return <Text>Пожалуйста, авторизуйтесь, чтобы увидеть уведомления.</Text>;
  }

  return (
    <div style={{ maxHeight: "400px", overflowY: "auto", padding: "16px" }}>
      {notifications.length > 0 ? (
        <Timeline mode="left">
          {notifications.map((item) => (
            <Timeline.Item
              key={item.id}
              dot={<NotificationOutlined style={{ fontSize: "20px" }} />}
              color={item.read ? "gray" : "blue"}
            >
              <Space direction="vertical" size="small">
                <Text strong={!item.read} style={{ fontSize: "16px" }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: "14px" }}>{item.message}</Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  <ClockCircleOutlined /> {new Date(item.date).toLocaleString()}
                </Text>
                <Button type="link" size="small">
                  <Link
                    to={
                      item.applicationId
                        ? `/applications/${item.applicationId}`
                        : "#"
                    }
                  >
                    Перейти к заявке
                  </Link>
                </Button>
              </Space>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Text>У вас нет уведомлений</Text>
      )}
    </div>
  );
};

export default NotificationPanel;
