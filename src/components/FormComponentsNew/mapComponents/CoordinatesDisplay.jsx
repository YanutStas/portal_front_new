import React from 'react'
import { Typography } from 'antd';

const Text = Typography.Text
const formatCoordinate = (coord) => Number(coord).toFixed(5);

export default function CoordinatesDisplay({ coordinates }) {

    if (!coordinates) return null;
    return (
        <div style={{ marginTop: 16 }}>
            {coordinates.point && (
                <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ display: "block", marginBottom: 4 }}>
                        Координаты точки:
                    </Text>
                    <Text code>
                        {formatCoordinate(coordinates.point[0])},{" "}
                        {formatCoordinate(coordinates.point[1])}
                    </Text>
                </div>
            )}

            {coordinates.polygon?.length > 0 && (
                <div>
                    <Text strong style={{ display: "block", marginBottom: 4 }}>
                        Координаты вершин области:
                    </Text>
                    {coordinates.polygon.map(([lat, lon], index) => (
                        <div key={index} style={{ marginBottom: 4 }}>
                            <Text type="secondary" style={{ marginRight: 8 }}>
                                Точка {index + 1}:
                            </Text>
                            <Text code>
                                {formatCoordinate(lat)}, {formatCoordinate(lon)}
                            </Text>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
