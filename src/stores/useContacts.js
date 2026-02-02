import { useState, useEffect } from "react";
import http from "../lib/http";
import clientLogger from "../lib/logging/clientLogger";

// Кастомный хук для загрузки контактов
export const useContacts = () => {
  const [contactCenters, setContactCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  const backPhotoServer = import.meta.env.VITE_BACK_API_SERVER;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await http.get("/api/contacts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        if (Array.isArray(response.data)) {
          const centersWithPhotos = response.data.map((center) => {
            const images = center.photos
              ? center.photos.map((photo) => ({
                  src: `${backPhotoServer}/${photo.ПутьКФайлу}`,
                  width: photo.width || 800,
                  height: photo.height || 600,
                }))
              : [];

            const latitude = parseFloat(center.latitude);
            const longitude = parseFloat(center.longitude);
            const hasCoordinates = !isNaN(latitude) && !isNaN(longitude);

            return {
              ...center,
              images,
              coordinates: hasCoordinates ? [latitude, longitude] : null,
            };
          });

          setContactCenters(centersWithPhotos);
        } else {
          console.error("Некорректные данные с бэка");
          clientLogger.warn(
            "FE/contacts",
            { url: "/api/contacts", dataType: typeof response.data },
            "Некорректные данные с бэка (ожидали массив)"
          );
        }
      } catch (error) {
        console.error("Ошибка при получении данных из API:", error);

        const status = error?.response?.status;
        const code = error?.code;

        // 5xx/таймауты уже залогируются глобальным interceptor’ом в http.js
        if (!status || (status < 500 && code !== "ECONNABORTED")) {
          clientLogger.error(
            "FE/contacts",
            { url: "/api/contacts", status, code },
            "Ошибка при получении контактов"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backPhotoServer]);

  return { contactCenters, loading };
};

export default useContacts;
