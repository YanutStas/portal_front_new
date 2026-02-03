import React, { useEffect, useState, useRef } from 'react';
import { Input, Form } from 'antd';
import WrapperComponent from './WrapperComponent';
import InfoDrawer from '../InfoDrawer';
import useGlobal from '../../stores/useGlobal';

export default function CadastrInput({
    name = 'cadastr',
    label = '',
    required = false,
    dependOf = false,
    howDepend = false,
    span = false,
    fullDescription = false,
    stylesField_key = false,
}) {
    const testData = useGlobal((state) => state.testData);
    const form = Form.useFormInstance();
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');

    // Синхронизация с внешним значением формы
    // useEffect(() => {
    //     const currentValue = form.getFieldValue(name);
    //     if (currentValue !== undefined && currentValue !== inputValue) {
    //         setInputValue(currentValue || '');
    //     }
    // }, [name, form, inputValue]);

    // Установка тестового значения
    useEffect(() => {
        if (testData) {
            form.setFieldValue(name, '50:11:0020104:6101');
        }
    }, [testData]);

    const formatWithCursor = (raw, cursorPos) => {
        raw = raw.replace(/[^\d,:]/g, '');

        // Принудительно 50/77 в начале
        if (raw.length >= 2 && !['50', '77'].includes(raw.substring(0, 2))) {
            raw = raw.length === 1 ? `5${raw}` : '50' + raw.slice(2);
        }
        if (raw.length === 0) {
            return { formatted: '', newCursor: 0 };
        }

        const region = raw.slice(0, 2);
        const district = raw.slice(2, 4);
        const rest = raw.slice(4);

        const quarterLen = rest.length >= 7 ? 7 : 6;
        const quarter = rest.slice(0, quarterLen);
        const obj = rest.slice(quarterLen);

        const parts = [region];
        if (district) parts.push(district);
        if (quarter) parts.push(quarter);
        if (obj) parts.push(obj);
        const formatted = parts.join(':');
        
        
        // Пересчёт позиции курсора:
        let newCursor = cursorPos;
        if (newCursor > 2 && formatted.length > 2) newCursor += 1;       // после region
        if (newCursor > 4 && formatted.length > 5) newCursor += 1;       // после district
        if (newCursor > 4 + quarterLen && formatted.length > 5 + quarterLen) newCursor += 1; // после quarter
        
        newCursor = Math.min(newCursor, formatted.length);
        return { formatted, newCursor };
    };
    
    const handleInputChange = (e) => {
        // console.log("e.target.", e.target);
        const { value, selectionStart } = e.target;
        // console.log("value", value);
        // console.log("selectionStart", selectionStart);
        
        const raw = value.replace(/[^\d,:]/g, '');
        const { formatted, newCursor } = formatWithCursor(raw, selectionStart);
        
        console.log(formatted);
        // setInputValue(formatted);
        form.setFieldValue(name, formatted);

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.setSelectionRange(newCursor, newCursor);
            }
        }, 0);
    };

    const handleKeyDown = (e) => {
        // console.log("handleKeyDown", e.key);
        if (
            e.key.length === 1 &&
            !/[0-9]/.test(e.key) &&
            !/:/.test(e.key) &&
            e.key !== 'Backspace' &&
            e.key !== 'Delete' &&
            e.key !== 'ArrowLeft' &&
            e.key !== 'ArrowRight' &&
            e.key !== 'Tab'
        ) {
            e.preventDefault();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const clipboardData = e.clipboardData || window.clipboardData;
        let pasted = clipboardData.getData('text');

        // Очищаем от всего, кроме цифр
        pasted = pasted.replace(/[^\d,:]/g, "");

        const { value, selectionStart } = inputRef.current;
        const rawBefore = value.replace(/[^\d,:]/g, "");
        const cursor = selectionStart;

        // Вставка происходит *в текущую позицию*:
        // разбиваем rawBefore на левую и правую части относительно курсора
        const leftDigits = rawBefore.slice(0, cursor);
        const rightDigits = rawBefore.slice(cursor);
        const newRaw = leftDigits + pasted + rightDigits;

        const { formatted, newCursor } = formatWithCursor(newRaw, cursor + pasted.length);

        setInputValue(formatted);
        form.setFieldValue(name, formatted);

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.setSelectionRange(newCursor, newCursor);
            }
        }, 0);
    };

    const formElement = (
        <Form.Item
            label={
                fullDescription ? (
                    <InfoDrawer fullDescription={fullDescription}>{label}</InfoDrawer>
                ) : (
                    label
                )
            }
            name={name}
            rules={[
                {
                    required: required,
                    message: 'Это поле обязательное',
                },
                {
                    validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const re = /^(50|77):\d{2}:\d{6,7}:\d{1,10}$/;
                        return re.test(value)
                            ? Promise.resolve()
                            : Promise.reject(new Error('Неверно введен кадастровый номер'));
                    },
                },
            ]}
        >
            <Input
                ref={inputRef}
                // value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                // on={handlePaste}
                maxLength={23}
                placeholder="XX:XX:XXXXXXX:XXXXXXXXX"
            />
        </Form.Item>
    );

    return (
        <WrapperComponent
            span={span}
            stylesField_key={stylesField_key}
            dependOf={dependOf}
            howDepend={howDepend}
            name={name}
        >
            {formElement}
        </WrapperComponent>
    );
}