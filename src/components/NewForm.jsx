import React, { useEffect, useState } from "react";
import { Divider, Form, Button, Flex, Typography } from "antd";
import TextInput from "./FormComponents/TextInput";
import CheckboxInput from "./FormComponents/CheckboxInput";
import SelectInput from "./FormComponents/SelectInput";
import AddressInput from "./FormComponents/AddressInput/AddressInput";
import SnilsInput from "./FormComponents/SnilsInput";
import UploaderInput from "./FormComponents/UploaderInput";
import ConfirmationDocumentInput from "./FormComponents/ConfirmationDocumentInput";
import DateInput from "./FormComponents/DateInput";
import useSubjects from "../stores/Cabinet/useSubjects";
import { formItemLayout } from "./configSizeForm";
import InnInput from "./FormComponents/InnInput";
import NameObjectInput from "./FormComponents/NameObjectInput";
import CadastralNumberInput from "./FormComponents/CadastralNumberInput";
import AddressObjectInput from "./FormComponents/AddressInput/AddressObjectInput";
import YMaps from "./FormComponents/YMaps";
import CustomDivider from "./FormComponents/CustomDivider";

const NewForm = ({
  fields,
  read: tempread = false,
  edit: tempedit = false,
  value = {},
  setShowModal,
  form,
  handlerSubmitForm,
  handlerDelete,
  handlerEdit,
}) => {
  const showModalView = useSubjects((state) => state.showModalView);
  const showModalAdd = useSubjects((state) => state.showModalAdd);
  const [edit, setEdit] = useState(tempedit);
  const [read, setRead] = useState(tempread);

  console.log("value!!!!!!!", value);

  useEffect(() => {
    setEdit(tempedit);
    setRead(tempread);
    form.resetFields();
    form.setFieldsValue(value);
  }, [showModalView, showModalAdd, tempedit, tempread]);

  const renderField = (field, index) => {
    switch (field.type) {
      case "new_divider":
        return (
          <CustomDivider
            key={index}
            name={field.name}
            description={field.description}
          />
        );
      case "divider":
        return <Divider key={index}>{field.name}</Divider>;
      case "description":
        return (
          <Typography.Paragraph key={index}>
            {field.description}
          </Typography.Paragraph>
        );
      case "textInput":
        return (
          <TextInput
            key={index}
            {...field}
            read={read}
            edit={edit}
            value={value[field.name]}
          />
        );
      case "innInput":
        return (
          <InnInput
            key={index}
            {...field}
            read={read}
            edit={edit}
            value={value[field.name]}
            type={field.entityType}
          />
        );
      case "selectInput":
        return (
          <SelectInput
            key={index}
            {...field}
            read={read}
            edit={edit}
            value={value[field.name]}
          />
        );
      case "uploaderInput":
        return (
          <UploaderInput
            key={index}
            {...field}
            value={value[field.name]}
            read={read}
            edit={edit}
          />
        );
      case "addressInput":
        return (
          <AddressInput
            key={index}
            {...field}
            read={read}
            edit={edit}
            value={value[field.name]}
          />
        );

      case "snilsInput":
        return (
          <SnilsInput
            key={index}
            {...field}
            read={read}
            edit={edit}
            value={value[field.name]}
          />
        );
      case "dateInput":
        return (
          <DateInput
            key={index}
            name={field.name}
            displayName={field.displayName}
            placeholder={field.placeholder}
            required={field.required}
            description={field.description}
            value={value[field.name]}
            read={read}
          />
        );
      case "checkboxInput":
        return (
          <CheckboxInput
            key={index}
            name={field.name}
            displayName={field.displayName}
            bindFields={field.bindFields}
            read={read}
          />
        );
      case "confirmationDocumentInput":
        return (
          <ConfirmationDocumentInput
            key={index}
            {...field}
            read={read}
            edit={edit}
            value={value}
          />
        );
      case "nameObjectInput":
        return (
          <NameObjectInput
            key={index}
            {...field}
            read={read}
            edit={edit}
            value={value[field.name]}
          />
        );
      case "сadastralNumberInput":
        return (
          <CadastralNumberInput
            key={index}
            {...field}
            read={read}
            edit={edit}
            value={value[field.name]}
          />
        );
      case "addressObjectInput":
        return (
          <AddressObjectInput
            key={index}
            {...field}
            read={read}
            edit={edit}
            value={value[field.name]}
          />
        );
      case "ymaps":
        return (
          <YMaps
            key={index}
            {...field}
            read={read}
            edit={edit}
            value={value[field.name]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form
      scrollToFirstError
      form={form}
      {...formItemLayout}
      onFinish={handlerSubmitForm}
      initialValues={edit ? value : false}
    >
      {fields.map(renderField)}
      {!read
      && !edit && (
        <Flex gap="middle">
          <Form.Item>
            <Button type="primary" onClick={() => form.submit()}>
              Добавить
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setShowModal(false)}>Закрыть</Button>
          </Form.Item>
        </Flex>
      )}
      {edit && (
        <Flex gap="middle">
          <Form.Item>
            <Button type="primary" onClick={() => handlerEdit(value.id)}>
              Обновить
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setShowModal(false)}>Закрыть</Button>
          </Form.Item>
        </Flex>
      )}
      {read && (
        <Flex gap="middle">
          <Form.Item>
            <Button
              type="primary"
              onClick={() => {
                setEdit(true);
                setRead(false);
              }}
            >
              Изменить
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              danger
              onClick={() => handlerDelete(value.id)}
            >
              Удалить
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setShowModal(false)}>Закрыть</Button>
          </Form.Item>
        </Flex>
      )}
    </Form>
  );
};

export default NewForm;
// import TextInput from "./FormComponents/TextInput";
// import CheckboxInput from "./FormComponents/CheckboxInput";
// import SelectInput from "./FormComponents/SelectInput";
// import AddressInput from "./FormComponents/AddressInput/AddressInput";
// import SnilsInput from "./FormComponents/SnilsInput";
// import UploaderInput from "./FormComponents/UploaderInput";
// import ConfirmationDocumentInput from "./FormComponents/ConfirmationDocumentInput";
// import DateInput from "./FormComponents/DateInput";
// import useSubjects from "../stores/Cabinet/useSubjects";
// import { formItemLayout } from "./configSizeForm";
// import InnInput from "./FormComponents/InnInput";
// import NameObjectInput from "./FormComponents/NameObjectInput";
// import CadastralNumberInput from "./FormComponents/CadastralNumberInput";
// import AddressObjectInput from "./FormComponents/AddressInput/AddressObjectInput";
// import YMaps from "./FormComponents/YMaps";
// import CustomDivider from "./FormComponents/CustomDivider";

// const NewForm = ({
//   fields,
//   read: tempread = false,
//   edit: tempedit = false,
//   value = {},
//   setShowModal,
//   form,
//   handlerSubmitForm,
//   handlerDelete,
//   handlerEdit,
// }) => {
//   const showModalView = useSubjects((state) => state.showModalView);
//   const showModalAdd = useSubjects((state) => state.showModalAdd);
//   const [edit, setEdit] = useState(tempedit);
//   const [read, setRead] = useState(tempread);
//   const [drawerVisible, setDrawerVisible] = useState(false);

//   const showDrawer = () => setDrawerVisible(true);
//   const onClose = () => setDrawerVisible(false);

//   console.log("value!!!!!!!", value);

//   useEffect(() => {
//     setEdit(tempedit);
//     setRead(tempread);
//     form.resetFields();
//   }, [showModalView, showModalAdd, tempedit, tempread]);

//   const renderField = (field, index) => {
//     switch (field.type) {
//       case "new_divider":
//         return (
//           <CustomDivider
//             key={index}
//             name={field.name}
//             description={field.description}
//           />
//         );
//       case "divider":
//         return <Divider key={index}>{field.name}</Divider>;
//       case "description":
//         return (
//           <Typography.Paragraph key={index}>
//             {field.description}
//           </Typography.Paragraph>
//         );
//       case "textInput":
//         return (
//           <TextInput
//             // form={form}
//             key={index}
//             {...field}
//             read={read}
//             edit={edit}
//             value={value[field.name]}
//           />
//         );
//       case "innInput":
//         return (
//           <InnInput
//             key={index}
//             {...field}
//             read={read}
//             edit={edit}
//             value={value[field.name]}
//             type={field.entityType}
//           />
//         );
//       case "selectInput":
//         return (
//           <SelectInput
//             key={index}
//             {...field}
//             read={read}
//             edit={edit}
//             value={value[field.name]}
//           />
//         );
//       case "uploaderInput":
//         return (
//           <UploaderInput
//             key={index}
//             {...field}
//             value={value[field.name]}
//             read={read}
//             edit={edit}
//           />
//         );
//       case "addressInput":
//         return (
//           <AddressInput
//             key={index}
//             {...field}
//             read={read}
//             edit={edit}
//             value={value[field.name]}
//           />
//         );

//       case "snilsInput":
//         return (
//           <SnilsInput
//             key={index}
//             {...field}
//             read={read}
//             edit={edit}
//             value={value[field.name]}
//           />
//         );
//       case "dateInput":
//         return (
//           <DateInput
//             key={index}
//             name={field.name}
//             displayName={field.displayName}
//             placeholder={field.placeholder}
//             required={field.required}
//             description={field.description}
//             value={value[field.name]}
//             read={read}
//           />
//         );
//       case "checkboxInput":
//         return (
//           <CheckboxInput
//             key={index}
//             name={field.name}
//             displayName={field.displayName}
//             bindFields={field.bindFields}
//             read={read}
//           />
//         );
//       case "confirmationDocumentInput":
//         return (
//           <ConfirmationDocumentInput
//             key={index}
//             {...field}
//             read={read}
//             edit={edit}
//             value={value}
//           />
//         );
//       case "nameObjectInput":
//         return (
//           <NameObjectInput
//             key={index}
//             {...field}
//             read={read}
//             edit={edit}
//             value={value[field.name]}
//           />
//         );
//       case "сadastralNumberInput":
//         return (
//           <CadastralNumberInput
//             key={index}
//             {...field}
//             read={read}
//             edit={edit}
//             value={value[field.name]}
//           />
//         );
//       case "addressObjectInput":
//         return (
//           <AddressObjectInput
//             key={index}
//             {...field}
//             read={read}
//             edit={edit}
//             value={value[field.name]}
//           />
//         );
//       case "ymaps":
//         return (
//           <YMaps
//             key={index}
//             {...field}
//             read={read}
//             edit={edit}
//             value={value[field.name]}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Form
//       scrollToFirstError
//       form={form}
//       {...formItemLayout}
//       onFinish={handlerSubmitForm}
//       initialValues={edit ? value : false}
//     >
//       {fields.map(renderField)}
//       {!read && !edit && (
//         <Flex gap="middle">
//           <Form.Item>
//             <Button type="primary" onClick={() => form.submit()}>
//               Добавить
//             </Button>
//           </Form.Item>
//           <Form.Item>
//             <Button onClick={() => setShowModal(false)}>Закрыть</Button>
//           </Form.Item>
//         </Flex>
//       )}
//       {edit && (
//         <Flex gap="middle">
//           <Form.Item>
//             <Button type="primary" onClick={() => handlerEdit(value.id)}>
//               Обновить
//             </Button>
//           </Form.Item>
//           <Form.Item>
//             <Button onClick={() => setShowModal(false)}>Закрыть</Button>
//           </Form.Item>
//         </Flex>
//       )}
//       {read && (
//         <Flex gap="middle">
//           <Form.Item>
//             <Button
//               type="primary"
//               onClick={() => {
//                 setEdit(true);
//                 setRead(false);
//               }}
//             >
//               Изменить
//             </Button>
//           </Form.Item>
//           <Form.Item>
//             <Button
//               type="primary"
//               danger
//               onClick={() => handlerDelete(value.id)}
//             >
//               Удалить
//             </Button>
//           </Form.Item>

//           {/* <Form.Item>
//             <Button
//               type="primary"
//               danger
//               onClick={() => handlerDelete(value.id)}
//             >
//               Удалить
//             </Button>
//           </Form.Item> */}
//           <Form.Item>
//             <Button onClick={() => setShowModal(false)}>Закрыть</Button>
//           </Form.Item>
//         </Flex>
//       )}
//     </Form>
//   );
// };

// export default NewForm;