import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import { Modal, Form, Input, AutoComplete, theme, Typography } from "antd";
import fieldConfig from "./AddressInput.json";
import axios from "axios";
import debounce from "lodash/debounce";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const AddressModal = ({ visible, onCancel, initialValues, name, defaultValue, form }, ref) => {
  const [options, setOptions] = useState({});
  const [formAddress] = Form.useForm();
  const { token } = theme.useToken();

  const fetchSuggestions = debounce((text, type) => {
    if (text.length > 1) {
      // console.log("area: ", formAddress.getFieldValue([name, "area"]));
      const formValue = {
        country: formAddress.getFieldValue("country"),
        region: formAddress.getFieldValue("region"),
        area: formAddress.getFieldValue("area"),
        city: formAddress.getFieldValue("city"),
        settlement: formAddress.getFieldValue("settlement"),
        street: formAddress.getFieldValue("street"),
      };
      const params = {
        type,
        query: text,
        // locations: [
        //   {
        //     country:
        //       formValue.country && type != "country"
        //         ? formValue.country
        //         : undefined,
        //     region:
        //       formValue.region && type != "region"
        //         ? formValue.region
        //         : undefined,
        //     area:
        //       formValue.area && type != "area" ? formValue.area : undefined,
        //     city:
        //       formValue.city && type != "city" ? formValue.city : undefined,
        //     settlement:
        //       formValue.settlement && type != "settlement"
        //         ? formValue.settlement
        //         : undefined,
        //     street:
        //       formValue.street && type != "street"
        //         ? formValue.street
        //         : undefined,
        //   },
        // ],
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
            // console.log("response.data", response.data);
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
                    {type === "fullAddress" ? item.unrestricted_value : item.data[`${type}_with_type`]}
                  </div>
                ),
                value: type === "fullAddress" ? item.unrestricted_value : item.data[`${type}_with_type`],
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
    setFieldsValue: formAddress.setFieldsValue,
  }));

  // useEffect(() => {
  //   formAddress.setFieldsValue(initialValues);
  // }, [initialValues]);

  const onSelect = (value, option, name) => {
    if (name === "fullAddress") {
      let temp = {}
      fieldConfig.forEach(item => {
        if (item.name !== "fullAddress") {
          temp[item.name] = option.data[`${item.name}_with_type`] || option.data[item.name]
        } else {
          temp.fullAddress = false
        }
      })
      console.log('temp', temp);

      formAddress.setFieldsValue(temp)
    }
    console.log("value", value);
    console.log("option", option);
  };
  const handleOk = () => {
    let address = {};
    fieldConfig.forEach((field) => {
      let currString = formAddress.getFieldValue(field.name);
      address[field.name] = currString
      if (currString) address.fullAddressForVisual = (address.fullAddressForVisual||'') + 
      // (field.type ? field.type + ' ' : '') + 
      currString + ", ";
    });
    address.fullAddressForVisual = address.fullAddressForVisual.slice(0, -2)
    form.setFieldValue(name, address);
    onCancel();
  };

  return (
    <Modal
      closable={false}
      open={visible}
      title="Введите адрес"
      onOk={handleOk}
      onCancel={onCancel}
      okText="Сохранить"
      width={800}
    >
      <Form form={formAddress}>
        {fieldConfig.map((field) => (
          <Form.Item
            name={field.name}
            label={field.label}
            key={field.name}
            labelCol={{ span: 8 }}
          // initialValue={}
          >
            <AutoComplete
              options={options[field.name]}
              onSelect={(value, option) => onSelect(value, option, field.name)}
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
      </Form>
      <Typography.Text style={{ color: "gray" }}>{form.getFieldValue(name)?.fullAddressForVisual}</Typography.Text>
    </Modal>
  );
}


export default AddressModal;
