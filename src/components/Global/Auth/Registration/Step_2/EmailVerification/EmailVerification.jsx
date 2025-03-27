import useRegistration from "../../../../../../stores/useRegistration";
import { Button, Form, Input } from "antd";
import EmailCodeVerification from "../EmailCodeVerification";

const EmailVerification = () => {
  const [form] = Form.useForm();

  const email = useRegistration((state) => state.email);
  const setEmail = useRegistration((state) => state.setEmail);
  const submitEmail = useRegistration((state) => state.submitEmail);
  const codeRequestedEmail = useRegistration(
    (state) => state.codeRequestedEmail
  );

  const onFinish = async (values) => {
    const result = await submitEmail(values.email);
    if (result && result.status === "ok") {}
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
          <Button type="primary" htmlType="submit">
            Получить код
          </Button>
        </Form.Item>
      </Form>
      {codeRequestedEmail && <EmailCodeVerification />}
    </div>
  );
};

export default EmailVerification;
