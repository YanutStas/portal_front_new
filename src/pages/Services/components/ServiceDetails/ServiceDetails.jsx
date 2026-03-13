import React from 'react';
import { Typography } from 'antd';
import ServiceItem from '../../../ServiceItem/ServiceItem';

const { Text } = Typography;

export const ServiceDetails = ({ selectedKey }) => {
    return (
        <div style={{ padding: "0 16px" }}>
            {selectedKey ? (
                <ServiceItem key={selectedKey} currentKey={selectedKey} />
            ) : (
                <Text type="secondary">
                    Выберите услугу из списка для просмотра деталей
                </Text>
            )}
        </div>
    );
};