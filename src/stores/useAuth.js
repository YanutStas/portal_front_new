import { create } from "zustand";
import axios from "axios";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const useAuth = create((set, get) => {
  return {
    auth: false,
    isAuthModalOpen: false,
    isCodeModalOpen: false,
    loginError: "",
    email: "",
    password: "",
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
        const response = await axios.post(
          `${backServer}/api/auth/login`,
          { email, password },
          { withCredentials: true }
        );
        if (response.data && response.status === 200) {
          set((state) => {
            state.startAuthTimer();
            return {
              email,
              password,
              isCodeRequested: true,
              loginError: "",
              showErrorModal: false,
            };
          });
        } else if (response.data && response.status === 403) {

        }
      } catch (error) {
        console.log(error)
        // if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        //   set(() => ({
        //     showErrorModal: true,
        //   }));
        // } else {
        if (error.status === 403) {
          return set(() => ({
            loginError: "Неверный логин или пароль",
            authTimer: 0,
            showErrorModal: true,
          }));
        }
         if (error.status === 423) {
          return set(() => ({
            loginError: "Пользователь заблокирован. Обратитесь в службу поддержки.",
            authTimer: 0,
            showErrorModal: true,
          }));
        }

        set(() => ({
          loginError: "Ошибка авторизации.",
          authTimer: 0,
          showErrorModal: true,
          showGlobalError: true
        }));
        // }
      }
    },

    verifyPincode: async (pincode) => {
      try {
        const response = await axios.post(
          `${backServer}/api/auth/logincode`,
          { pincode },
          { withCredentials: true }
        );
        if (response.data && response.status === 200) {
          localStorage.setItem("jwt", response.data.jwt);
          set(() => ({
            auth: true,
            isCodeModalOpen: false,
            isAuthModalOpen: false,
            loginError: "",
          }));
        } else {
          set(() => ({
            loginError: "Неверный пинкод.",
          }));
        }
      } catch (error) {
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
        password: "",
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
          const res = await axios.post(`${backServer}/api/auth/checkjwt`, {
            jwt: localStorage.getItem("jwt"),
          });
          validJwt = res.data;
        } catch (error) {
          console.log(error);
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
