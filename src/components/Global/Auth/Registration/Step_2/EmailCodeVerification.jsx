import React, { useEffect, useRef } from "react";
import { Form, Input, Typography } from "antd";
import useRegistration from "../../../../../stores/useRegistration";
import styles from "./EmailCodeVerification.module.css";

const EmailCodeVerification = () => {
  const submitEmailCode = useRegistration((state) => state.submitEmailCode);
  const isSendingCodeEmail = useRegistration((state) => state.isSendingCodeEmail);
  const codeRequestedEmailError = useRegistration((state) => state.codeRequestedEmailError);
  const formRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const onFinish = (values) => {
    const emailCode = values.otp;
    submitEmailCode(emailCode);
  };

  const handleChange = (value) => {
    if (value.length === 4) {
      formRef.current.submit();
    }
  };

  return (
    <>
      <Typography.Text level={5}>Введите код из письма:</Typography.Text>
      <Form
        ref={formRef}
        name="emailCodeForm"
        onFinish={onFinish}
        className={styles.codeFormContainer}
      >
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Пожалуйста, введите код из письма" },
          ]}
        >
          <Input.OTP
            disabled={isSendingCodeEmail}
            ref={inputRef}
            onChange={handleChange}
            length={4}
            formatter={(str) => str.toUpperCase()}
            className={styles.codeInput}
          />
        </Form.Item>
      </Form>
       {codeRequestedEmailError && <Typography.Text style={{color:"red"}}>{codeRequestedEmailError}</Typography.Text>}
    </>
  );
};

export default EmailCodeVerification;

// import { Form, Input,Typography } from "antd";
// import Title from "antd/es/typography/Title";
// import useRegistration from "../../../../../stores/useRegistration";
// import styles from "./EmailCodeVerification.module.css"; // Убедитесь, что путь к CSS-файлу правильный

// const EmailCodeVerification = () => {
//   const submitEmailCode = useRegistration((state) => state.submitEmailCode);
//   const formRef = useRef(null);
//   const inputRefs = useRef([]);

//   const onFinish = (values) => {
//     const emailCode = Object.values(values).join("");
//     submitEmailCode(emailCode);
//   };

//   const handleInputChange = (e, index) => {
//     if (e.target.value.length === 1) {
//       if (index < 3) {
//         inputRefs.current[index + 1].focus();
//       } else {
//         formRef.current.submit();
//       }
//     }
//   };

//   return (
//     <>
//       <Typography.Text level={5}>Введите код из письма:</Typography.Text>
//       <Form ref={formRef} onFinish={onFinish} className={styles.codeFormContainer}>
//         {Array.from({ length: 4 }, (_, index) => (
//           <Form.Item
//             key={index}
//             name={`pin${index + 1}`}
//             rules={[{ required: true, message: "Введите цифру" }]}
//           >
//             <Input
//               className={styles.codeInput}
//               ref={(el) => (inputRefs.current[index] = el)}
//               maxLength={1}
//               onChange={(e) => handleInputChange(e, index)}
//             />
//           </Form.Item>
//         ))}
//       </Form>
//     </>
//   );
// };

// export default EmailCodeVerification;
