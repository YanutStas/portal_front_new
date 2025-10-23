import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
} from "react";
import { Modal, Form, Input, AutoComplete, theme, Typography, Divider, Flex, Select, Button, Descriptions } from "antd";
import fieldConfig from "./AddressInput.json";
import axios from "axios";
import debounce from "lodash/debounce";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const AddressModal = ({ visible, onCancel, initialValues, name, defaultValue, form, label }, ref) => {
  const [refAuto, setRefAuto] = useState({});

  const [options, setOptions] = useState({});
  const [fullAddressForVisual, setFullAddressForVisual] = useState();
  const [isSelectAddress, setIsSelectAddress] = useState(false);
  const [formAddress] = Form.useForm();
  // const { token } = theme.useToken();
  useEffect(() => {
    if (visible) {
      formAddress.scrollToField('fullAddress', { focus: true })
      if (typeof form.getFieldValue(name) === "undefined") {
        formAddress.resetFields()
      }
      // formAddress.focusField('fullAddress')
    }
  }, [visible])

  const fetchSuggestions = debounce((text, type) => {
    if (text.length > 1) {
      // console.log("area: ", formAddress.getFieldValue([name, "area"]));
      // const formValue = {
      //   country: formAddress.getFieldValue("country"),
      //   region: formAddress.getFieldValue("region"),
      //   area: formAddress.getFieldValue("area"),
      //   city: formAddress.getFieldValue("city"),
      //   settlement: formAddress.getFieldValue("settlement"),
      //   street: formAddress.getFieldValue("street"),
      // };
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
  }, 1000);
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
          temp[item.name] = option.data[`${item.name}`] || option.data[item.name]
          temp[`${item.name}_type`] = option.data[`${item.name}_type`] || undefined
        } else {
          temp.fullAddress = undefined
        }
      })
      // console.log('temp', temp);
      formAddress.setFieldsValue(temp)
      manualInput()
      // setIsSelectAddress(true)
    }
    // console.log("value", value);
    // console.log("option", option);
  };
  const handleOk = () => {

    // let address = {};
    // fieldConfig.forEach((field) => {
    //   let currString = formAddress.getFieldValue(field.name);
    //   address[field.name] = currString
    //   if (currString) address.fullAddressForVisual = (address.fullAddressForVisual || '') +
    //     // (field.type ? field.type + ' ' : '') + 
    //     currString + ", ";
    // });
    // address.fullAddressForVisual = address.fullAddressForVisual.slice(0, -2)
    // setFullAddressForVisual(address.fullAddressForVisual)
    const dataAddress = concatAddressString()
    if (dataAddress && dataAddress.fullAddress !== '') {
      form.setFieldValue(name, concatAddressString());
    } else {
      form.setFieldValue(name, undefined);
    }
    onCancel();
  };

  const manualInput = () => {
    setFullAddressForVisual(concatAddressString().fullAddress)
  }
  const concatAddressString = () => {
    let address = { fullAddress: "" }
    fieldConfig.forEach(item => {
      // console.log(item);
      const addText = formAddress.getFieldValue(item.name)
      const addType = formAddress.getFieldValue(`${item.name}_type`)
      if (addText) {
        if (addType) {
          // if (item.name === "region" || item.name === "area" || item.name === "city" || item.name === "settlement" || item.name === "street") {
          //   address[item.name] = addText + ' ' + addType
          //   address[`${item.name}_type`] = addType            
          // } else {
          //   address[item.name] = addType + ' ' + addText
          //   address[`${item.name}_type`] = addType
          // }
          address[item.name] = addText
          address[`${item.name}_type`] = addType

        } else {
          address[item.name] = addText
        }
        // addText + (addType && (item.name === "region" || item.name === "area" || item.name === "city" || item.name === "settlement") ? ' ' + addType : '')
        address.fullAddress = address.fullAddress + (addType && item.name !== "region" ? addType + ' ' : '') + addText + (addType && item.name === "region" ? ' ' + addType : '') + ", "
      }
    })
    address.fullAddress = address.fullAddress.slice(0, -2)
    formAddress.setFieldValue("fullAddress", address.fullAddress)
    return address
  }
  // useEffect(() => {
  //   // const rect = refAutoComplete.current.getBoundingClientRect();
  //   console.log(refAutoComplete);

  // }, []);

  return (
    <Modal
      closable={true}
      open={visible}
      title={`${label}:`}
      // cancelButtonProps={{style:{display:"none"}}}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Закрыть"
      width={800}
    >

      {/* <Button onClick={() => {
        formAddress.setFieldValue('fullAddress', formAddress.getFieldValue('fullAddress') + 1)
      }}>Тест добавления</Button> */}
      {/* <Typography.Title level={5}>{fullAddressForVisual || <span style={{ color: "red" }}>адрес не выбран</span>}</Typography.Title> */}
      {/* <Divider /> */}
      <Form form={formAddress}>
        <div vertical gap={10} wrap={"wrap"}>

          <Form.Item
            style={{ flex: 1 }}
            name={"fullAddress"}
          // label={"Поиск по ФИАС"}

          >
            <AutoComplete
              autoFocus={true}
              options={options.fullAddress}
              onSelect={(value, option) => onSelect(value, option, "fullAddress")}
              onSearch={(text) => fetchSuggestions(text, "fullAddress")}
              // defaultValue={defaultValue[field.name]}
              disabled={defaultValue.fullAddress}
              // popupRender={(elem) => {
              //   console.log(elem);
              //   return <Button>{elem}</Button>
              // }}
              styles={{
                popup: {
                  root: {
                    // inset: "",
                    top: refAuto,
                  }
                }
              }}
            >

              <Input.TextArea
                ref={(ref) => {
                  setRefAuto(ref?.resizableTextArea?.textArea?.getBoundingClientRect().bottom)
                  // console.log(ref?.resizableTextArea?.textArea?.getBoundingClientRect().bottom);
                }}
                placeholder={`Поиск по базе адресов`}
                autoSize={{ minRows: 1, maxRows: 4 }}
              // size="large"
              />

            </AutoComplete>
          </Form.Item>
          <Flex justify="center" style={{ marginBottom: 20 }}>

            <Button onClick={() => { setIsSelectAddress(!isSelectAddress) }}>Ручная корректировка</Button>
          </Flex>
        </div>
        {isSelectAddress &&
          <>
            {/* <Divider>Корректировка</Divider> */}
            {fieldConfig.map((field) => (
              <Flex key={field.name} gap={10}>
                {field.type &&
                  <Form.Item
                    name={`${field.name}_type`}
                    style={{ width: 200 }}
                    labelCol={{ span: 8 }}
                  >
                    <Select
                      // size="small"
                      options={field.type && field.type.map(item => ({
                        value: item.type,
                        label: item.type_full
                      }))}
                      // defaultValue={0}
                      placeholder="Тип"
                      onChange={manualInput}
                    />
                  </Form.Item>
                }
                <Form.Item
                  name={field.name}
                  style={{ flex: 1 }}
                  // label={field.label}
                  // key={field.name}
                  labelCol={{ span: 8 }}
                // initialValue={}
                >
                  {/* <AutoComplete
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
            </AutoComplete> */}
                  <Input.TextArea
                    // size="small"
                    placeholder={`${field.label}`}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    onChange={manualInput}
                  />
                </Form.Item>
              </Flex>
            ))}
          </>
        }

      </Form>
      {/* <Divider/> */}
      {/* <Descriptions items={[{
        key: '1',
        label: 'Выбранный адрес',
        children: fullAddressForVisual,
      }]} /> */}
      {/* <Typography.Title level={5}>Выбранный адрес:</Typography.Title>
      <Typography.Text style={{ color: "gray" }}>{fullAddressForVisual}</Typography.Text> */}
      {isSelectAddress &&
        <Flex vertical gap={10}>

          <Flex justify="center" style={{}}>

            <Button color="danger" variant="outlined" onClick={() => {
              formAddress.resetFields()
              setFullAddressForVisual(false)
              setOptions({})
              // setIsSelectAddress(false)
            }}>Очистить</Button>
          </Flex>
        </Flex>
      }
    </Modal>
  );
}


export default AddressModal;
