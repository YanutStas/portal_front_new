import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import { Modal, Form, Input, AutoComplete, theme } from "antd";
import fieldConfig from "./AddressInput.json";
import axios from "axios";
import debounce from "lodash/debounce";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const AddressModal = forwardRef(
  ({ visible, onCancel, initialValues, name, defaultValue }, ref) => {
    const [options, setOptions] = useState({});
    const form = Form.useFormInstance();
    const { token } = theme.useToken();

    const fetchSuggestions = debounce((text, type) => {
      if (text.length > 1) {
        console.log("area: ", form.getFieldValue([name, "area"]));
        const formValue = {
          country: form.getFieldValue([name, "country"]),
          region: form.getFieldValue([name, "region"]),
          area: form.getFieldValue([name, "area"]),
          city: form.getFieldValue([name, "city"]),
          settlement: form.getFieldValue([name, "settlement"]),
          street: form.getFieldValue([name, "street"]),
        };
        const params = {
          type,
          query: text,
          locations: [
            {
              country:
                formValue.country && type != "country"
                  ? formValue.country
                  : undefined,
              region:
                formValue.region && type != "region"
                  ? formValue.region
                  : undefined,
              area:
                formValue.area && type != "area" ? formValue.area : undefined,
              city:
                formValue.city && type != "city" ? formValue.city : undefined,
              settlement:
                formValue.settlement && type != "settlement"
                  ? formValue.settlement
                  : undefined,
              street:
                formValue.street && type != "street"
                  ? formValue.street
                  : undefined,
            },
          ],
        };

        axios
          .get(`${backServer}/api/cabinet/getDaData`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            withCredentials: true,
            params,
          })
          .then((response) => {
            if (response.data && response.data.data) {
              console.log("response.data", response.data);
              setOptions({
                [type]: response.data.data.map((item, index) => ({
                  label: (
                    <div
                      key={index}
                      style={{
                        maxWidth: "100%",
                        whiteSpace: "break-spaces",
                        paddingBottom: 5,
                        borderBottom: `1px solid rgba(133,133,133,.2)`,
                      }}
                    >
                      {item.data[type]}
                    </div>
                  ),
                  value: item.data[type],
                  data: item.data,
                  // unrestricted_value: item.unrestricted_value,
                })),
              });
            } else {
              setOptions({ [type]: [] });
            }
          })
          .catch((error) => {
            console.error("Ошибка запроса к бэкенду:", error);
            setOptions({ [type]: [] });
          });
      }
    }, 500);
    // Используем useImperativeHandle для управления формой из родительского компонента
    useImperativeHandle(ref, () => ({
      setFieldsValue: form.setFieldsValue,
    }));

    useEffect(() => {
      form.setFieldsValue(initialValues);
    }, [initialValues]);

    const onSelect = (value, option) => {
      console.log("value", value);
      console.log("option", option);
    };
    const handleOk = () => {
      let fullString = "";
      fieldConfig.forEach((field) => {
        let currString = form.getFieldValue([name, field.name]);
        if (currString) fullString = fullString + (field.type ? field.type + ' ' : '') + currString + ", ";
      });
      form.setFieldValue([name, "fullAddress"], fullString);
      onCancel();
    };

    return (
      <Modal
        closable={false}
        open={visible}
        title="Введите адрес вручную"
        onOk={handleOk}
        onCancel={onCancel}
        okText="Сохранить"
      >
        {fieldConfig.map((field) => (
          <Form.Item
            name={field.name}
            label={field.label}
            key={field.name}
            labelCol={{ span: 8 }}
            initialValue={defaultValue[field.name]}
          >
            <AutoComplete
              options={options[field.name]}
              onSelect={(value, option) => onSelect(value, option)}
              onSearch={(text) => fetchSuggestions(text, field.name)}
              // defaultValue={defaultValue[field.name]}
              disabled={defaultValue[field.name]}
            >
              {field.type === "textArea" ? (
                <Input.TextArea
                  placeholder={`Введите ${field.label.toLowerCase()}`}
                />
              ) : (
                <Input placeholder={`Введите ${field.label.toLowerCase()}`} />
              )}
            </AutoComplete>
          </Form.Item>
        ))}
      </Modal>
    );
  }
);

export default AddressModal;
