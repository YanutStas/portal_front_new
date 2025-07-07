import React from "react";
import { Form, theme } from "antd";
import { IMaskInput } from "react-imask";
import styles from "./Phone.module.css";
import WrapperComponent from "../WrapperComponent";
import InfoDrawer from "../../InfoDrawer";
import useProfile from "../../../../src/stores/Cabinet/useProfile";

export default function PhoneInput({
  name = "mobilePhone",
  label = "Мобильный телефон",
  disabled = false,
  placeholder = "+7 (XXX) XXX-XX-XX",
  required = false,
  dependOf = false,
  howDepend = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
  read = false
}) {
  const { colorBorderBg, colorText, colorBorder } = theme.useToken().token;
  const { profile } = useProfile();

  const isAdditionalPhone = name === "dc284366-c637-441d-b552-dcf24ad603af";
  const phoneFromProfile = isAdditionalPhone ? "" : profile.phone || "";

  return (
    <WrapperComponent
      span={span}
      stylesField_key={stylesField_key}
      dependOf={dependOf}
      howDepend={howDepend}
      name={name}
      read={read}
    >
      <Form.Item noStyle shouldUpdate>
        {(formInstance) => {
          const errors = formInstance.getFieldError(name) || [];
          const hasError = errors.length > 0;

          return (
            <Form.Item
              name={name}
              label={
                fullDescription ? (
                  <InfoDrawer fullDescription={fullDescription}>
                    {label}
                  </InfoDrawer>
                ) : (
                  label
                )
              }
              rules={[
                {
                  required: required,
                  message: "Это поле обязательное",
                },
              ]}
              initialValue={phoneFromProfile}
              validateStatus={hasError ? "error" : ""}
              help={hasError ? errors[0] : undefined}
            >
              <IMaskInput
                mask="+7 (900) 000-00-00"
                disabled={disabled}
                placeholder={placeholder}
                className={`ant-input ant-input-outlined ${styles.inputMask}`}
                style={{
                  backgroundColor: colorBorderBg,
                  color: colorText,
                  border: hasError
                    ? "1px solid red"
                    : `1px solid ${colorBorder}`,
                  fontSize: 18,
                }}
              />
            </Form.Item>
          );
        }}
      </Form.Item>
    </WrapperComponent>
  );
}

// import React from "react";
// import { Form, theme } from "antd";
// import ReactInputMask from "react-input-mask";
// import styles from "./Phone.module.css";
// import WrapperComponent from "../WrapperComponent";
// import InfoDrawer from "../../InfoDrawer";

// import useProfile from "../../../../src/stores/Cabinet/useProfile";

// export default function PhoneInput({

//   name = "mobilePhone",
//   label = "Мобильный телефон",
//   disabled = false,
//   placeholder = "+7 (XXX) XXX-XX-XX",
//   required = false,
//   dependOf = false,
//   howDepend = false,
//   span = false,
//   fullDescription = false,
//   stylesField_key = false,
// }) {
//   const { colorBorderBg, colorText, colorBorder } = theme.useToken().token;
//   const { profile } = useProfile();

//   const isAdditionalPhone = name === "dc284366-c637-441d-b552-dcf24ad603af";
//   const phoneFromProfile = isAdditionalPhone ? "" : profile.phone || "";

//   return (
//     <WrapperComponent
//       span={span}
//       stylesField_key={stylesField_key}
//       dependOf={dependOf}
//       howDepend={howDepend}
//       name={name}
//     >
//       <Form.Item noStyle shouldUpdate>
//         {(formInstance) => {
//           const errors = formInstance.getFieldError(name) || [];
//           const hasError = errors.length > 0;

//           return (
//             <Form.Item
//               name={name}
//               label={
//                 fullDescription ? (
//                   <InfoDrawer fullDescription={fullDescription}>
//                     {label}
//                   </InfoDrawer>
//                 ) : (
//                   label
//                 )
//               }
//               rules={[

//                 {
//                   required: required,
//                   message: "Это поле обязательное",
//                 },
//               ]}
//               initialValue={phoneFromProfile}
//               validateStatus={hasError ? "error" : ""}
//               help={hasError ? errors[0] : undefined}
//             >
//               <ReactInputMask
//                 mask="+7 (999) 999-99-99"

//                 disabled={disabled}
//                 placeholder={placeholder}
//                 className={`ant-input ant-input-outlined ${styles.inputMask}`}
//                 style={{
//                   backgroundColor: colorBorderBg,
//                   color: colorText,
//                   border: hasError
//                     ? "1px solid red"
//                     : `1px solid ${colorBorder}`,
//                   fontSize: 18,
//                 }}
//               />
//             </Form.Item>
//           );
//         }}
//       </Form.Item>
//     </WrapperComponent>
//   );

// }
