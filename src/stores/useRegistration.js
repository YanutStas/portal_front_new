import { create } from "zustand";
import axios from "axios";
import useAuth from "./useAuth";
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const useRegistration = create((set, get) => ({
  registrationStep: 0,
  phone: "",
  email: "",
  phoneCode: "",
  emailCode: "",
  password: "",

  phoneVerified: false,
  isSendingPhone: false,
  phoneVerifiedError: false,

  codeRequested: false,
  isSendingCodePhone: false,
  codeRequestedError: false,


  emailVerified: false,
  isSendingEmail: false,
  emailVerifiedError: false,

  codeRequestedEmail: false,
  isSendingCodeEmail: false,
  codeRequestedEmailError: false,

  isRegistering: false,

  setRegistrationStep: (step) => set(() => ({ registrationStep: step })),
  setPhone: (phone) => set(() => ({ phone })),
  setEmail: (email) => set(() => ({ email })),
  setPhoneVerified: (verified) => set(() => ({ phoneVerified: verified })),
  setEmailVerified: (verified) => set(() => ({ emailVerified: verified })),
  setCodeRequested: (value) => set({ codeRequested: value }),

  submitPhone: async (phone) => {
    set(() => ({ isSendingPhone: true, codeRequestedError: false }));
    try {
      const response = await axios.post(
        `${backServer}/api/registration/phone`,
        { phone },
        { withCredentials: true }
      );

      if (response.data?.status === "ok") {
        set(() => ({
          phone,
          phoneSubmitted: true,
          codeRequested: true,
          isSendingPhone: false,
          codeRequestedError: false,
        }));
        return { ok: true };
      }

      const msg =
        response?.data?.message ||
        "Не удалось отправить код. Попробуйте позже.";
      set(() => ({
        isSendingPhone: false,
        codeRequestedError: msg,
      }));
      return { ok: false, message: msg };
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Ошибка при отправке СМС. Попробуйте позже.";
      console.error("Ошибка при отправке номера телефона", error);
      set(() => ({
        isSendingPhone: false,
        codeRequestedError: msg,
      }));
      return { ok: false, error: msg };
    }
  },

  submitPhoneCode: async (phoneCode) => {
    set(() => ({ isSendingCodePhone: true, codeRequestedError: false }));
    try {
      const response = await axios.post(
        `${backServer}/api/registration/phonecode`,
        { phoneCode },
        { withCredentials: true }
      );

      if (response.data?.status === "ok") {
        get().setPhoneVerified(true);
        set(() => ({
          registrationStep: 2,
          codeRequested: false,
          isSendingCodePhone: false,
          codeRequestedError: false,
        }));
        return { ok: true };
      }

     
      const attemptsLeft =
        typeof response?.data?.phoneCount === "number"
          ? response.data.phoneCount
          : undefined;
      const baseMsg =
        response?.data?.message || "Неверный код.";
      const msg =
        attemptsLeft !== undefined
          ? `${baseMsg} Осталось попыток: ${attemptsLeft}.`
          : baseMsg;

      set(() => ({
        isSendingCodePhone: false,
        codeRequestedError: msg,
      }));
      return { ok: false, attemptsLeft };
    } catch (error) {
      console.error("Ошибка при подтверждении пин-кода", error);
      set(() => ({
        isSendingCodePhone: false,
        codeRequestedError: "Ошибка подтверждения кода. Попробуйте позже.",
      }));
      return { ok: false, error: true };
    }
  },

  submitEmail: async (email) => {
    set(() => ({
      isSendingEmail: true,
    }));

    try {
      const response = await axios.post(
        `${backServer}/api/registration/email`,
        { email },
        { withCredentials: true }
      );
      if (response.data.status === "ok") {
        set(() => ({
          email,
          emailSubmitted: true,
          codeRequestedEmail: true,
          emailVerifiedError: false,
          isSendingEmail: false,
        }));
      } else {
        console.error(response.data.message);
        set(() => ({
          emailVerifiedError: true,
          isSendingEmail: false,
        }));
      }
    } catch (error) {
      console.error("Ошибка при отправке email", error);
      set(() => ({
        emailVerifiedError: true,
        isSendingEmail: false,
      }));
    }
  },

  submitEmailCode: async (emailCode) => {
    set(() => ({
      isSendingCodeEmail: true,
    }));
    try {
      const response = await axios.post(
        `${backServer}/api/registration/emailcode`,
        { emailCode },
        { withCredentials: true }
      );
      if (response.data.status === "ok") {
        get().setEmailVerified(true);
        set(() => ({
          codeRequestedEmailError: false,
          registrationStep: 1,
          codeRequestedEmail: false,
          isSendingCodeEmail: false,
        }));
      } else {
        console.error("Неверный пин-код");
        set(() => ({
          codeRequestedEmailError: "Неверный пин-код",
          isSendingCodeEmail: false,
        }));
      }
    } catch (error) {
      console.error("Ошибка при подтверждении пин-кода", error);
      set(() => ({
        codeRequestedEmailError: error.message,
        isSendingCodeEmail: false,
      }));
    }
  },

  registerUser: async (password) => {
    if (!get().emailVerified || !get().phoneVerified) {
      console.error("Email или телефон не подтвержден.");
      return;
    }

    try {
      set({ isRegistering: true });

      const registrationResponse = await axios.post(
        `${backServer}/api/registration/newuser`,
        { email: get().email, phone: get().phone, password },
        { withCredentials: true }
      );

      if (registrationResponse.data.status === "ok") {
        localStorage.setItem("jwt", registrationResponse.data.jwt);
        useAuth.getState().toggleAuth(true);
        useAuth.getState().toggleModal("isAuthModalOpen", false);
      } else {
        console.error(registrationResponse.data.message);
      }
      set({ isRegistering: false });
    } catch (error) {
      set({ isRegistering: false });
      console.error("Ошибка при регистрации пользователя", error);
    }
  },
}));

export default useRegistration;
