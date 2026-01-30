import useRegistration from "../../../../../../stores/useRegistration";
import { Button, Form, Input, Typography } from "antd";
import EmailCodeVerification from "../EmailCodeVerification";

const EmailVerification = () => {
  const [form] = Form.useForm();

  const email = useRegistration((state) => state.email);
  const setEmail = useRegistration((state) => state.setEmail);
  const submitEmail = useRegistration((state) => state.submitEmail);
  const isSendingEmail = useRegistration((state) => state.isSendingEmail);
  const emailVerifiedError = useRegistration((state) => state.emailVerifiedError);
  const codeRequestedEmail = useRegistration(
    (state) => state.codeRequestedEmail
  );

  const onFinish = async (values) => {
    const result = await submitEmail(values.email);
    // if (result && result.status === "ok") {

    // } else {

    // }
  };

  const onEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
  };

  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Почта"
          name="email"
          rules={[
            {
              required: true,
              message: "Это поле обязательно",
            },
            {
              type: "email",
              message: "Пожалуйста, введите корректный email",
            },
          ]}
        >
          <Input value={email} onChange={onEmailChange} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isSendingEmail}>
            Получить код
          </Button>
        </Form.Item>
      </Form>
      {codeRequestedEmail && <EmailCodeVerification />}
      {emailVerifiedError && <Typography.Text style={{color:"red"}}>При отправке кода на почту произошла ошибка. Попробуйте позднее.</Typography.Text>}
    </div>
  );
};

export default EmailVerification;
