import {
  Form,
  Typography,
  Button,
  Flex,
  Breadcrumb,
  ConfigProvider,
  Row,
  Tag,
  Modal,
  Empty,
  List,
  Alert,
  message
} from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import useClaims from "../../stores/Cabinet/useClaims";
import useServices from "../../stores/useServices";
import AppHelmet from "../../components/Global/AppHelmet";
import moment from "moment";
import Preloader from "../../components/Main/Preloader";
import ErrorModal from "../../components/ErrorModal";
import SubmitModal from "../../components/SubmitModal";
import { motion } from "framer-motion";

import selectComponent from "../../components/selectComponent";
import useGlobal from "../../stores/useGlobal";

const version = import.meta.env.VITE_BACK_VERSION;

const { Title } = Typography;

export default function NewClaim() {
  const { setTestData, testData } = useGlobal((state) => state)
  const [testForm, setTestForm] = useState(false)
  // const chain = useServices((state) => state.chain);
  const serviceItem = useServices((state) => state.serviceItem);
  const fetchServiceItem = useServices((state) => state.fetchServiceItem);
  const isLoading = useServices((state) => state.isLoading);
  const createClaim = useClaims((state) => state.createClaim);
  const newClaim = useClaims((state) => state.newClaim);
  const clearNewClaim = useClaims((state) => state.clearNewClaim);
  const {
    blockButtonNewClaim,
    addBlockButtonNewClaim,
    removeBlockButtonNewClaim,
  } = useClaims((state) => state);
  const { id } = useParams();
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const [validationErrors, setValidationErrors] = useState([]);
  const [showValidationModal, setShowValidationModal] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    setTestData(false)
    fetchServiceItem(id, { withChain: true, withFields: true });
  }, []);

  // useEffect(() => {
  //   if (newClaim) {
  //     console.log("newClaim", newClaim);
  //   }
  // }, [newClaim]);

  const onClose = () => {
    clearNewClaim();
    setIsDirty(false);
  };

  const onFinish = async (values) => {
    let newValues = {};

    const addNewValue = (value) => {
      // console.log(value.__proto__.constructor.name);

      if (typeof value === "object" &&
        // Object.hasOwn(value, "$d")
        (value.__proto__.constructor.name === "Moment"||
          value.__proto__.constructor.name === "M2")
      ) {
        return moment(value._d).format();
      } else if (!Array.isArray(value)) {
        return value;
      }
    };

    for (const [key, value] of Object.entries(values)) {
      if (Array.isArray(value)) {
        // addNewValueArray(value,key)
        newValues[key] = values[key].map((element) => {
          let newElement = {};
          for (const [key, value] of Object.entries(element)) {
            newElement[key] = addNewValue(value);
          }
          return newElement;
        });
      } else {
        newValues[key] = addNewValue(value);
      }
    }

    try {
      console.log("Данные для создания заявки: ", newValues);
      addBlockButtonNewClaim();
      if (!testForm) {
        await createClaim({
          versionId: serviceItem.versionId,
          serviceId: serviceItem.Ref_Key,
          values: newValues,
        });
        // console.log("Отправили заявку");

      } else {
        messageApi.open({
          type: 'success',
          content: 'Форма успешно проверена',
        });
      }
      removeBlockButtonNewClaim();
      setIsDirty(false);
    } catch (err) {
      console.log(err.message || "Ошибка при создании заявки.");
      removeBlockButtonNewClaim();
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };
  console.log(serviceItem);

  const onFinishFailed = ({ errorFields }) => {
    setValidationErrors(errorFields);
    setShowValidationModal(true);
  };

  const pickLabel = (f = {}) =>
    f.displayName ||
    f.label ||
    f.display_name ||
    f.caption ||
    f.title ||
    f.placeholder ||
    f.name ||
    f.description ||
    null;

  const buildFieldLabelMap = (fields = []) => {
    const map = new Map();

    const dive = (node) => {
      if (!node || typeof node !== "object") return;

      const keys = [
        node.Ref_Key,
        node.name,
        node.id,
        node.field,
        node.code,
        node.key,
        node.guid,
        node.fieldKey,
        // IMPORTANT: many fields (особенно документы) используют idLine как name
        node.idLine,
        // иногда ключ может лежать внутри component
        node.component && node.component.idLine,
        node.component && node.component.name,
      ].filter(Boolean);

      const label = pickLabel(node);
      if (label) {
        keys.forEach((k) => map.set(String(k), String(label)));
      }

      // возможные контейнеры с вложенными полями
      const nests = [
        node.fields,
        node.children,
        node.items,
        node.bindFields,
        node.options,
        node.props && node.props.fields,
        // Также просматриваем описание самого компонента
        node.component,
        node.component && node.component.fields,
        node.component && node.component.children,
      ].filter(Boolean);

      nests.forEach((arr) => {
        if (Array.isArray(arr)) arr.forEach(dive);
        else if (typeof arr === "object") Object.values(arr).forEach(dive);
      });
    };

    (Array.isArray(fields) ? fields : []).forEach(dive);
    return map;
  };

  const fieldLabelMap = useMemo(
    () => buildFieldLabelMap(serviceItem?.fields || []),
    [serviceItem]
  );

  const getLabelFromService = (namePath) => {
    const parts = Array.isArray(namePath)
      ? namePath
        .filter((p) => typeof p === "string" || typeof p === "number")
        .map(String)
      : [String(namePath)];

    for (let i = parts.length - 1; i >= 0; i--) {
      const k = parts[i];
      const lbl = fieldLabelMap.get(k);
      if (lbl) return lbl;
    }

    for (let i = parts.length; i > 0; i--) {
      const joinDot = parts.slice(0, i).join(".");
      const lbl = fieldLabelMap.get(joinDot);
      if (lbl) return lbl;
    }

    return null;
  };

  const getLabelFromDom = (namePath) => {
    try {
      const inst = form.getFieldInstance(namePath);

      const node =
        inst instanceof HTMLElement
          ? inst
          : inst?.input ||
          inst?.resizableTextArea?.textArea ||
          inst?.nativeElement;

      const container =
        node?.closest?.(".ant-form-item") || node?.closest?.(".ant-card");

      const labelNode = container?.querySelector?.(
        ".ant-form-item-label label"
      );
      if (labelNode) {
        const text = (
          labelNode.textContent ||
          labelNode.innerText ||
          ""
        ).trim();
        const cleaned = text.replace(/[＊*]\s*|[:：]\s*$/g, "").trim();
        if (cleaned) return cleaned;
      }

      const cardTitle = container?.querySelector?.(".ant-card-head-title");
      if (cardTitle) {
        const text = (
          cardTitle.textContent ||
          cardTitle.innerText ||
          ""
        ).trim();
        if (text) return text;
      }

      return null;
    } catch {
      return null;
    }
  };

  const getReadableFieldNames = (errorFields = []) => {
    const result = [];
    const used = new Set();

    errorFields.forEach(({ name }) => {
      const label =
        getLabelFromService(name) || getLabelFromDom(name) || "Поле формы";

      if (!used.has(label)) {
        used.add(label);
        result.push(label);
      }
    });

    return result;
  };
  const handlerOnClick = () => {
    setTestData(true)
  }
  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      {contextHolder}
      <AppHelmet
        title={"Новая заявка"}
        desc={"Новая заявка - Портал цифровых услуг АО Мособлэнерго"}
      />
      {isLoading && (
        <Flex style={{ height: "300px" }} align="center" justify="center">
          <Preloader />
        </Flex>
      )}
      {!isLoading && serviceItem && (
        <>
          <Breadcrumb
            separator=">"
            itemRender={(currentRoute) => {
              return <Link to={currentRoute.href}>{currentRoute.title}</Link>;
            }}
            items={
              serviceItem &&
              serviceItem.path.map((item) => ({
                href: `/services/${item.Ref_Key}`,
                title: item.label,
              }))
            }
          />
          <ConfigProvider
            theme={{
              token: {},
              components: {
                Select: {
                  optionFontSize: 18,
                  fontSize: 18,
                },
                Input: {
                  fontSize: 18,
                },
                Form: {
                  labelFontSize: 18,
                  verticalLabelPadding: "0 0 4px",
                  itemMarginBottom: 0,
                },
              },
            }}
          >
            <Title>{serviceItem.label}</Title>
            <Flex gap={10} style={{ marginBottom: "1.2rem" }} wrap="wrap">
              {serviceItem.tags.map((item, index) => (
                <Tag
                  key={index}
                  style={{ fontSize: "1.2rem", lineHeight: "1.8rem" }}
                  color={item.color?.name}
                >
                  {item.name}
                </Tag>
              ))}
            </Flex>
            {(version === "local" || version === "test") &&
              <Flex justify="flex-end">
                <Button disabled={testData} onClick={handlerOnClick}>Заполнить тестовыми данными</Button>
              </Flex>
            }

            <Form
              scrollToFirstError={{
                // boundary: (parent) => {
                //   // console.log(parent);
                // },
                behavior: (actions) => {
                  // console.log(actions);
                  actions.forEach(({ el, top, left }) => {
                    // implement the scroll anyway you want
                    el.scrollTop = top - 100;
                    el.scrollLeft = left;

                    // // If you need the relative scroll coordinates, for things like window.scrollBy style logic or whatever, just do the math
                    // const offsetTop = el.scrollTop - top
                    // const offsetLeft = el.scrollLeft - left
                  });
                },
              }}
              form={form}
              labelAlign="right"
              layout="vertical"
              onFinish={(values) => {
                setTestForm(false)
                onFinish(values)
              }}
              // onFinish={onFinish}
              onKeyDown={handleKeyDown}
              onValuesChange={() => setIsDirty(true)}
              style={{
                width: "100%",
                margin: "0 auto",
              }}
              labelWrap
              validateTrigger={["onSubmit", "onChange"]}
              onFinishFailed={onFinishFailed}
            >
              <Row gutter={[20, 20]} align={"stretch"}>
                {serviceItem.fields
                  ?.sort((a, b) => a.lineNum - b.lineNum)
                  .map((item, index) => selectComponent(item, index))}
              </Row>
              {serviceItem?.fields?.length > 0 && (
                <Flex justify="center" gap={20} style={{ marginTop: 20, }}>

                  {/* {(version === "local" || version === "test") && */}
                    <Button onClick={() => {
                      setTestForm(true)
                      form.submit()
                    }}>Проверить форму</Button>
                  {/* } */}
                  <Form.Item>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={blockButtonNewClaim}
                      >
                        {serviceItem.buttonText || "Подать заявку на услугу"}
                      </Button>
                    </motion.div>
                  </Form.Item>
                </Flex>
              )}
              {!serviceItem?.fields?.length > 0 && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Typography.Text>Отсутствует содержимое</Typography.Text>
                  }
                />
              )}
            </Form>
          </ConfigProvider>
        </>
      )}
      {newClaim && (
        <SubmitModal
          open={!!newClaim}
          claim={{ ...newClaim }}
          onClose={onClose}
        />
      )}
      {error && <ErrorModal visible={!!error} error={error} />}
      {showValidationModal && (
        <Modal
          cancelButtonProps={{ style: { display: "none" } }}
          keyboard={false}
          open={showValidationModal}
          closable={false}
          onOk={() => setShowValidationModal(false)}
          onCancel={() => setShowValidationModal(false)}
          maskClosable={false}
          width={600}
          okText="Продолжить"
          style={{ top: 20 }}
        >
          <Alert
            message={`Вы не заполнили данные в обязательных полях экранной формы заявки:`}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <List
            size="small"
            bordered
            dataSource={getReadableFieldNames(validationErrors)}
            renderItem={(label, idx) => (
              <List.Item
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <span style={{ fontSize: "14px" }}>
                  {idx + 1}. {label}
                </span>
              </List.Item>
            )}
            style={{ maxHeight: "220px", overflowY: "auto" }}
          />

          <div style={{ marginTop: 16, color: "#8c8c8c", fontSize: "12px" }}>
            Внимание! Для подачи заявки на выбранную Вами услугу необходимо
            заполнить все обязательные поля.
          </div>
        </Modal>
      )}
    </div>
  );
}
