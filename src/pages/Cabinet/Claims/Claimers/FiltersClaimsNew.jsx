import React, { useEffect, useState,useRef } from "react";
import { Flex, Form, Input, InputNumber, Select, Typography, DatePicker, ConfigProvider, Row, Col } from "antd";
// import moment from "moment";
import dayjs from 'dayjs'
import locale from 'antd/locale/ru_RU';
import debounce from 'lodash/debounce';

import 'dayjs/locale/ru';

dayjs.locale('ru');
const { RangePicker } = DatePicker
export default function FiltersClaimsNew({ filters, setSelectFilters }) {
    // 1. Создаём debounced-функцию и храним её в ref, чтобы не пересоздавать при ререндерах
    const debouncedApiCall = useRef(
        debounce((allValues) => {
            setSelectFilters(allValues)
            console.log('Отправка на бэкенд:', allValues);
            // fetch('/api/save', { method: 'POST', body: JSON.stringify(allValues) })
        }, 1000) // задержка 1 секунда
    ).current;

    // 2. Обязательно отменяем таймер при размонтировании компонента
    useEffect(() => {
        return () => debouncedApiCall.cancel();
    }, [debouncedApiCall]);

    // 3. Передаём в onValuesChange
    const handleValuesChange = (changedValues, allValues) => {
        // Опционально: срабатывать только если изменилось нужное поле
        // if (!changedValues.code) return;

        debouncedApiCall(allValues);
    };


    return (
        <ConfigProvider
            locale={locale}
            theme={{
                components: {
                    Form: {
                        verticalLabelPadding: 0
                    },
                }
            }}
        >
            <Form
                layout="vertical"
                onFinish={(values) => {
                    console.log("values", values);
                }}
                onValuesChange={handleValuesChange}
                styles={{
                    label: {
                        padding: 0
                    }
                }}
            >

                <Flex gap={10} wrap={"wrap"}>
                    {filters && filters.map((item, index) =>
                        <Form.Item
                            style={{ marginBottom: 0 }}
                            name={item.name}
                            label={item.label}
                        >
                            {/* ----------------------------------------------------------------------------------------------------- */}
                            {item.type === "number" && <Input style={{ minWidth: 300 }} />}

                            {/* ----------------------------------------------------------------------------------------------------- */}
                            {item.type === "dateRange" &&
                                <RangePicker
                                    format={{ format: "DD.MM.YYYY" }}
                                    // locale={{lang:"" }} 
                                    minDate={dayjs(item.min)}
                                    maxDate={dayjs(item.max)}
                                />}

                            {/* ----------------------------------------------------------------------------------------------------- */}
                            {item.type === "select" && <Select
                                allowClear
                                showSearch={{
                                    filterOption: (input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
                                }}
                                maxTagTextLength={10}
                                options={item.options}
                                style={{ minWidth: 300 }}
                            />}
                        </Form.Item>

                    )}

                </Flex>
            </Form>
        </ ConfigProvider>
    )
}

// [
//     {
//         "name": "number",
//         "label": "Номер заявки",
//         "type": "number"
//     },
//     {
//         "name": "date",
//         "label": "Период заявки",
//         "type": "dateRange",
//         "min": "2025-10-07T16:30:22",
//         "max": "2026-05-12T16:40:00"
//     },
//     {
//         "name": "service",
//         "label": "Услуга",
//         "type": "select",
//         "options": [
//             {
//                 "label": "Максимальная мощность до 15 кВт включительно по III категории надежности электроснабжения для бытовых нужд (701)",
//                 "value": "a220c128-18fc-11ef-94f0-5ef3fcb042f8"
//             },
//             {
//                 "label": "Восстановление и переоформление документов о технологическом присоединении (1)",
//                 "value": "29ee686c-19bb-11ef-94f0-5ef3fcb042f8"
//             },
//             {
//                 "label": "Восстановление и переоформление документов о технологическом присоединении (1)",
//                 "value": "6ecbb18a-19bc-11ef-94f0-5ef3fcb042f8"
//             },
//             {
//                 "label": "Для граждан, имеющих льготный статус, согласно нормам законодательства РФ. Максимальная мощность до 15 кВт включительно (1)",
//                 "value": "7bf190db-738e-11f0-bb9a-005056859fbf"
//             }
//         ]
//     },
//     {
//         "name": "status",
//         "label": "Статус",
//         "type": "select",
//         "options": [
//             {
//                 "label": "Заявка принята (700)",
//                 "value": "69ba24f7-8bda-11f0-86f1-c8d9d20cde1f"
//             },
//             {
//                 "label": "Заявка отклонена (2)",
//                 "value": "69ba2563-8bda-11f0-86f1-c8d9d20cde1f"
//             },
//             {
//                 "label": "Услуга оказана (1)",
//                 "value": "69ba24f2-8bda-11f0-86f1-c8d9d20cde1f"
//             },
//             {
//                 "label": "Заявка аннулирована (1)",
//                 "value": "69ba24f4-8bda-11f0-86f1-c8d9d20cde1f"
//             }
//         ]
//     }
// ]