import { create } from "zustand";
import http from "../lib/http";
import clientLogger from "../lib/logging/clientLogger";

const useAuth = create((set, get) => {
  return {
    auth: false,
    isAuthModalOpen: false,
    isCodeModalOpen: false,
    loginError: "",
    email: "",
    isCodeRequested: false,
    authTimer: 0,
    redirection: "",
    showErrorModal: false,
    showGlobalError: false,
    authTab: "1",

    toggleAuth: (value) => {
      set((state) => ({
        auth: typeof value === "undefined" ? !state.auth : value,
      }));
    },

    toggleModal: (modalName, value) => {
      set((state) => ({
        ...state,
        [modalName]: typeof value === "undefined" ? !state[modalName] : value,
      }));
      return true;
    },
    setRedirection: (redirection) => {
      set((state) => ({
        redirection,
      }));
      return true;
    },

    startAuthTimer: () => {
      set((state) => {
        if (state.authTimerInterval) {
          clearInterval(state.authTimerInterval);
        }
        return { authTimer: 30, authTimerInterval: null };
      });
      const timerId = setInterval(() => {
        set((state) => {
          if (state.authTimer <= 0) {
            clearInterval(timerId);
            return { authTimer: 0, authTimerInterval: null };
          }
          return { authTimer: state.authTimer - 1 };
        });
      }, 1000);
      set({ authTimerInterval: timerId });
    },

    login: async (email, password) => {
      try {
        const response = await http.post(
          "/api/auth/login",
          { email, password }
        );
        if (response.data && response.status === 200) {
          const maskedEmail =
            typeof email === "string"
              ? email.replace(/^(.{2}).*(@.*)$/, "$1***$2")
              : "";

          clientLogger.info(
            "AUTH/login",
            { email: maskedEmail, status: response.status },
            "Запрошен пин-код для входа"
          );

          set((state) => {
            state.startAuthTimer();
            return {
              email,
              isCodeRequested: true,
              loginError: "",
              showErrorModal: false,
            };
          });
        }
      } catch (error) {
        console.log(error);
        const status = error.response?.status;
        const code = error?.code;
        const maskedEmail =
          typeof email === "string"
            ? email.replace(/^(.{2}).*(@.*)$/, "$1***$2")
            : "";

        if (status === 403) {
          clientLogger.warn(
            "AUTH/login",
            { email: maskedEmail, status, code },
            "Неверный логин или пароль"
          );
          return set(() => ({
            loginError: "Неверный логин или пароль",
            authTimer: 0,
            showErrorModal: true,
          }));
        }

        if (status === 423) {
          clientLogger.warn(
            "AUTH/login",
            { email: maskedEmail, status, code },
            "Пользователь заблокирован"
          );
          return set(() => ({
            loginError:
              "Пользователь заблокирован. Обратитесь в службу поддержки.",
            authTimer: 0,
            showErrorModal: true,
          }));
        }

        clientLogger.error(
          "AUTH/login",
          { email: maskedEmail, status, code },
          "Техническая ошибка авторизации"
        );

        return set(() => ({
          loginError: "Ошибка авторизации.",
          authTimer: 0,
          showErrorModal: true,
          showGlobalError: true,
        }));
      }
    },

    verifyPincode: async (pincode) => {
      try {
        const response = await http.post(
          "/api/auth/logincode",
          { pincode }
        );
        if (response.data && response.status === 200) {
          clientLogger.info(
            "AUTH/verifyPincode",
            { status: response.status },
            "Пин-код подтверждён, получили JWT"
          );
          localStorage.setItem("jwt", response.data.jwt);
          set(() => ({
            auth: true,
            isCodeModalOpen: false,
            isAuthModalOpen: false,
            loginError: "",
          }));
        } else {
          clientLogger.warn(
            "AUTH/verifyPincode",
            { status: response.status },
            "Неверный пинкод (ответ не 200)"
          );
          set(() => ({
            loginError: "Неверный пинкод.",
          }));
        }
      } catch (error) {
        const status = error?.response?.status;
        const code = error?.code;

        clientLogger.error(
          "AUTH/verifyPincode",
          { status, code },
          "Ошибка при подтверждении пинкода"
        );

        set(() => ({
          loginError:
            error.response?.data?.message ||
            "Ошибка при подтверждении пинкода.",
        }));
      }
    },

    logout: () => {
      localStorage.removeItem("jwt");
      set(() => ({
        auth: false,
        email: "",
        isCodeRequested: false,
        loginError: "",
        isAuthModalOpen: false,
        isCodeModalOpen: false,
        showErrorModal: false,
      }));
    },

    checkJWT: async () => {
      let validJwt = false;
      if (localStorage.getItem("jwt")) {
        try {
          const res = await http.post("/api/auth/checkjwt", {
            jwt: localStorage.getItem("jwt"),
          });
          validJwt = res.data;
        } catch (error) {
          console.log(error);
          const status = error?.response?.status;
          const code = error?.code;

          clientLogger.warn(
            "AUTH/checkJWT",
            { status, code },
            "Не удалось проверить JWT"
          );

          return false;
        }
      }
      if (!get().auth && validJwt) {
        set((state) => ({
          auth: true,
        }));
        return true;
      }
      return false;
    },

    resetCodeRequest: () => {
      set({ isCodeRequested: false });
    },

    // Новый метод для установки вкладки
    setAuthTab: (tabKey) => {
      set({ authTab: tabKey });
    },
  };
});

export default useAuth;
