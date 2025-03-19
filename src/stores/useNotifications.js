import { useState, useEffect } from "react";
import useAuth from "./useAuth";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { auth } = useAuth(); 

  // Функция для добавления нового уведомления
  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [
      notification,
      ...prevNotifications,
    ]);
  };

  // Функция для пометки уведомления как прочитанного
  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Функция для получения количества непрочитанных уведомлений
  const getUnreadCount = () => {
    return notifications.filter((notif) => !notif.read).length;
  };

  // Имитируем получение уведомлений при загрузке
  useEffect(() => {
    if (!auth) {
      // Если пользователь не авторизован, сбрасываем уведомления
      setNotifications([]);
      return;
    }

    // Здесь можно будет заменить на реальный запрос к серверу
    const mockNotifications = [
      {
        id: 1,
        title: "Заявка отправлена",
        message: "Ваша заявка №1234 успешно отправлена.",
        read: false,
        date: new Date(),
      },
      {
        id: 2,
        title: "Статус заявки изменен",
        message: 'Статус вашей заявки №1234 изменен на "В обработке".',
        read: false,
        date: new Date(),
      },
    ];
    setNotifications(mockNotifications);
  }, [auth]); // Обновляем уведомления при изменении статуса авторизации

  return {
    notifications,
    addNotification,
    markAsRead,
    getUnreadCount,
  };
};

export default useNotifications;
