import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import 'antd/dist/reset.css';
import { Button, Flex, Form, Input, Radio, Tabs, Typography } from 'antd';
import styles from './MapDisplay.module.css';
import { PlusOutlined, DeleteOutlined, BorderOutlined, ClearOutlined, EnvironmentOutlined } from '@ant-design/icons';

// OpenLayers imports
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { fromLonLat, toLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import Text from 'ol/style/Text';
import Modify from 'ol/interaction/Modify';
import Snap from 'ol/interaction/Snap';

// Координаты Москвы (дефолт)
const MOSCOW_LAT = 55.7558;
const MOSCOW_LON = 37.6173;
const DEFAULT_ZOOM = 9;

// Источники тайловых слоёв
// ВНИМАНИЕ: URL Яндекса могут меняться. Ниже приведены рабочие на текущий момент варианты через публичные прокси/эндпоинты.
const tileSources = {
  '2gis': new TileLayer({
    source: new XYZ({
      url: 'https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}',
      maxZoom: 18,
      crossOrigin: 'anonymous',
      attributions: '&copy; <a href="https://2gis.ru">2GIS</a>'
    }),
    visible: false 
  }),
  'rgis': new TileLayer({
    source: new XYZ({
      url: 'https://rgis.mosreg.ru/wmts/m10/{z}/{x}/{y}.png',
      maxZoom: 18,
      crossOrigin: 'anonymous',
      attributions: '&copy; РГИС МО'
    }),
    visible: false
  }),
  'YandexScheme': new TileLayer({
    source: new XYZ({
      // ИСПРАВЛЕНО: убрана восьмерка после {x}
      url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&lang=ru_RU',
      maxZoom: 18,
      attributions: '&copy; <a href="https://yandex.ru/maps">Yandex карты</a>'
    }),
    visible: false
  }),
  'YandexSat': new TileLayer({
    source: new XYZ({
      // Рабочий шаблон для Яндекс Спутника
      url: 'https://core-sat.maps.yandex.net/tiles?l=sat&v=3.926.0&z={z}&x={x}&y={y}&scale=1&lang=ru_RU',
      maxZoom: 18,
      crossOrigin: 'anonymous',
      attributions: '&copy; Yandex Maps'
    }),
    visible: false
  })
};

// Хелпер для форматирования числа до 6 знаков
const formatCoord = (val) => {
  if (val === undefined || val === null) return '';
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  return num.toFixed(6);
};

const MapWithLayerSwitcher = ({
  coordinates,
  setSelectedPoint,
  polygonPoints = [],
  setPolygonPoints
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const vectorSourceRef = useRef(null);
  const vectorLayerRef = useRef(null); 

  const pointFeatureRef = useRef(null);
  const polygonFeatureRef = useRef(null);
  const vertexFeaturesRef = useRef([]);

  const [activeTab, setActiveTab] = useState('1'); 
  const [activeLayer, setActiveLayer] = useState('2gis');

  const activeTabRef = useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const isPointValid = Array.isArray(coordinates) && coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1]);
  const [lat, lon] = isPointValid ? coordinates : [0, 0];

  // --- 1. Инициализация карты ---
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    vectorSourceRef.current = new VectorSource();

    const styleFunction = (feature) => {
      const type = feature.get('type');
      const isPointMode = activeTabRef.current === '1';

      if (type === 'main-point') {
        const color = isPointMode ? '#ff4d4f' : '#52c41a';
        return new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="${color}" stroke="#fff" stroke-width="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
            `),
            scale: 1.3, 
          })
        });
      }

      if (type === 'polygon-fill') {
        if (isPointMode) {
           return new Style({
            fill: new Fill({ color: 'rgba(82, 196, 26, 0.2)' }), 
            stroke: new Stroke({
              color: '#52c41a', 
              width: 3 
            }),
          });
        } else {
          return new Style({
            fill: new Fill({ color: 'rgba(24, 144, 255, 0.2)' }),
            stroke: new Stroke({
              color: '#1890ff',
              width: 2
            }),
          });
        }
      }

      if (type === 'vertex') {
        if (isPointMode) {
          return new Style({ image: new CircleStyle({ radius: 0 }) });
        }

        const index = feature.get('index') + 1;
        return new Style({
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({ color: '#ff4d4f' }),
            stroke: new Stroke({ color: '#fff', width: 2 }),
          }),
          text: new Text({
            text: String(index),
            fill: new Fill({ color: '#fff' }),
            font: 'bold 12px sans-serif',
            offsetY: 1,
          })
        });
      }
      return null;
    };

    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
      style: styleFunction
    });
    
    vectorLayerRef.current = vectorLayer;

    const map = new Map({
      target: mapRef.current,
      layers: [
        tileSources['2gis'],
        tileSources['YandexScheme'],
        tileSources['YandexSat'],
        tileSources['rgis'],
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([MOSCOW_LON, MOSCOW_LAT]),
        zoom: DEFAULT_ZOOM
      })
    });

    const modifyInteraction = new Modify({ source: vectorSourceRef.current });
    map.addInteraction(modifyInteraction);

    const snapInteraction = new Snap({ source: vectorSourceRef.current });
    map.addInteraction(snapInteraction);

    modifyInteraction.on('modifyend', (evt) => {
      evt.features.forEach((feature) => {
        const type = feature.get('type');
        if (type === 'main-point') {
          const geom = feature.getGeometry();
          const [newLon, newLat] = toLonLat(geom.getCoordinates());
          if (setSelectedPoint) setSelectedPoint([newLat, newLon]);
        }
        if (type === 'vertex') {
          const index = feature.get('index');
          const geom = feature.getGeometry();
          const [newLon, newLat] = toLonLat(geom.getCoordinates());
          if (setPolygonPoints) {
            setPolygonPoints(prev => {
              const next = [...prev];
              next[index] = [newLat, newLon];
              return next;
            });
          }
        }
      });
    });

    map.on('singleclick', (event) => {
      if (activeTabRef.current === '1') {
        const clickedCoord = event.coordinate;
        const [clickedLon, clickedLat] = toLonLat(clickedCoord);
        if (setSelectedPoint) setSelectedPoint([clickedLat, clickedLon]);
      }
    });

    mapInstanceRef.current = map;

    // Инициализация видимости
    Object.keys(tileSources).forEach(key => {
      tileSources[key].setVisible(key === activeLayer);
    });

    return () => {
      map.setTarget(null);
      mapInstanceRef.current = null;
    };
  }, []); 

  // --- Остальная логика без изменений ---

  useEffect(() => {
    if (!vectorSourceRef.current) return;
    if (!isPointValid) {
      if (pointFeatureRef.current) {
        vectorSourceRef.current.removeFeature(pointFeatureRef.current);
        pointFeatureRef.current = null;
      }
      return;
    }
    const newGeom = new Point(fromLonLat([lon, lat]));
    if (!pointFeatureRef.current) {
      pointFeatureRef.current = new Feature({ geometry: newGeom, type: 'main-point' });
      vectorSourceRef.current.addFeature(pointFeatureRef.current);
    } else {
      pointFeatureRef.current.setGeometry(newGeom);
    }
    vectorSourceRef.current.changed();
  }, [lat, lon, isPointValid]); 

  useEffect(() => {
    if (!vectorSourceRef.current) return;
    if (polygonFeatureRef.current) {
      vectorSourceRef.current.removeFeature(polygonFeatureRef.current);
      polygonFeatureRef.current = null;
    }
    vertexFeaturesRef.current.forEach(f => vectorSourceRef.current.removeFeature(f));
    vertexFeaturesRef.current = [];

    if (!polygonPoints || polygonPoints.length < 3) return;

    const olCoords = polygonPoints.map(p => fromLonLat([p[1], p[0]])); 
    if (olCoords.length > 0) {
      const first = olCoords[0];
      const last = olCoords[olCoords.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) olCoords.push(first);
    }

    const polyGeom = new Polygon([olCoords]);
    polygonFeatureRef.current = new Feature({ geometry: polyGeom, type: 'polygon-fill' });
    vectorSourceRef.current.addFeature(polygonFeatureRef.current);

    polygonPoints.slice(0, polygonPoints.length).forEach((point, index) => {
      const [pLat, pLon] = point;
      const vertexFeat = new Feature({
        geometry: new Point(fromLonLat([pLon, pLat])),
        type: 'vertex',
        index: index 
      });
      vertexFeaturesRef.current.push(vertexFeat);
      vectorSourceRef.current.addFeature(vertexFeat);
    });
    vectorSourceRef.current.changed();
  }, [polygonPoints]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    Object.keys(tileSources).forEach(key => {
      tileSources[key].setVisible(key === activeLayer);
    });
  }, [activeLayer]);

  useEffect(() => {
    if (vectorLayerRef.current) vectorLayerRef.current.getSource()?.changed();
  }, [activeTab]);

  const handlePointChange = (index, value) => {
    if (!setSelectedPoint) return;
    const currentCoords = Array.isArray(coordinates) && coordinates.length === 2 ? [...coordinates] : [0, 0];
    currentCoords[index] = value;
    setSelectedPoint(currentCoords);
  };

  const handlePolygonVertexChange = (vertexIndex, coordIndex, value) => {
    if (!setPolygonPoints) return;
    const newPoly = [...polygonPoints];
    const vertex = [...newPoly[vertexIndex]];
    vertex[coordIndex] = value;
    newPoly[vertexIndex] = vertex;
    setPolygonPoints(newPoly);
  };

  const handleAddDefaultPoint = () => {
    if (!mapInstanceRef.current || !setSelectedPoint) return;
    const view = mapInstanceRef.current.getView();
    const center = view.getCenter();
    if (center) {
      const [lon, lat] = toLonLat(center);
      setSelectedPoint([lat, lon]);
    }
  };

  const handleClearPoint = () => { if (setSelectedPoint) setSelectedPoint([]); };

  const addPolygonVertex = () => {
    if (!setPolygonPoints) return;
    let newPoint;
    if (polygonPoints.length === 0) {
       if (mapInstanceRef.current) {
          const view = mapInstanceRef.current.getView();
          const center = view.getCenter();
          const [lon, lat] = toLonLat(center);
          newPoint = [lat, lon];
       } else { newPoint = [55.75, 37.62]; }
    } else {
       const lastPoint = polygonPoints[polygonPoints.length - 1];
       let offsetDegrees = 0.001; 
       if (mapInstanceRef.current) {
         const resolution = mapInstanceRef.current.getView().getResolution();
         if (resolution) {
            const offsetMeters = resolution * 100; 
            offsetDegrees = Math.max(offsetMeters / 111000, offsetMeters / 63000);
         }
       }
       newPoint = [lastPoint[0] + offsetDegrees, lastPoint[1] + offsetDegrees];
    }
    setPolygonPoints([...polygonPoints, newPoint]);
  };

  const removePolygonVertex = (index) => {
    if (!setPolygonPoints || polygonPoints.length <= 3) return;
    setPolygonPoints(polygonPoints.filter((_, i) => i !== index));
  };

  const handleAddDefaultArea = () => {
    if (!mapInstanceRef.current || !setPolygonPoints) return;
    const view = mapInstanceRef.current.getView();
    const center = view.getCenter(); 
    const resolution = view.getResolution(); 
    if (!center || !resolution) return;

    const sizeInMeters = 80; 
    const halfSize = sizeInMeters / 2;
    const topLeftProj = [center[0] - halfSize, center[1] + halfSize];
    const topRightProj = [center[0] + halfSize, center[1] + halfSize];
    const bottomRightProj = [center[0] + halfSize, center[1] - halfSize];
    const bottomLeftProj = [center[0] - halfSize, center[1] - halfSize];

    const p1 = toLonLat(topLeftProj);     
    const p2 = toLonLat(topRightProj);
    const p3 = toLonLat(bottomRightProj);
    const p4 = toLonLat(bottomLeftProj);

    setPolygonPoints([
      [p1[1], p1[0]], [p2[1], p2[0]], [p3[1], p3[0]], [p4[1], p4[0]]
    ]);
  };

  const handleClearPolygon = () => { if (setPolygonPoints) setPolygonPoints([]); };

  return (
    <Flex gap={10} wrap={"wrap"} style={{ width: '100%' }}>
      <div style={{ flex: '0 0 300px' }}>
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} items={[
            {
              key: '1', label: "Точка", children: (
                <Flex vertical gap={10}>
                  {!isPointValid ? (
                    <Flex vertical align="center" gap={10} style={{ padding: '20px 0' }}>
                      <Typography.Text type="secondary">Точка не задана</Typography.Text>
                      <Button type="primary" icon={<EnvironmentOutlined />} onClick={handleAddDefaultPoint}>Добавить точку (по центру)</Button>
                    </Flex>
                  ) : (
                    <>
                      <Flex justify="space-between" align="center">
                         <Typography.Text type="secondary" style={{ fontSize: 12 }}>Координаты маркера</Typography.Text>
                         <Button size="small" danger type="text" icon={<ClearOutlined />} onClick={handleClearPoint}>Очистить</Button>
                      </Flex>
                      <Form.Item label="Широта" style={{ marginBottom: 0 }}><Input size='small' value={formatCoord(coordinates[0])} onChange={(e) => handlePointChange(0, e.target.value)} /></Form.Item>
                      <Form.Item label="Долгота" style={{ marginBottom: 0 }}><Input size='small' value={formatCoord(coordinates[1])} onChange={(e) => handlePointChange(1, e.target.value)} /></Form.Item>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>Кликните по карте или введите координаты.</Typography.Text>
                    </>
                  )}
                </Flex>
              )
            },
            {
              key: '2', label: "Область", children: (
                <Flex vertical gap={10} style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {(!polygonPoints || polygonPoints.length === 0) ? (
                    <Flex vertical align="center" gap={10} style={{ padding: '20px 0' }}>
                      <Typography.Text type="secondary">Область не задана</Typography.Text>
                      <Button type="primary" icon={<BorderOutlined />} onClick={handleAddDefaultArea}>Добавить область (по центру)</Button>
                    </Flex>
                  ) : (
                    <>
                      <Flex justify="space-between" align="center">
                         <Typography.Text type="secondary" style={{ fontSize: 12 }}>Вершины полигона</Typography.Text>
                         <Button size="small" danger type="text" icon={<ClearOutlined />} onClick={handleClearPolygon}>Очистить</Button>
                      </Flex>
                      {polygonPoints.map((item, index) => (
                        <Flex vertical key={index}> 
                          <Typography.Text style={{ minWidth: 60 }}>{`Вершина ${index + 1}`}</Typography.Text>
                          <Flex gap={5} align="center" >
                            <Input size='small' placeholder="Lat" value={formatCoord(item[0])} onChange={(e) => handlePolygonVertexChange(index, 0, e.target.value)} />
                            <Input size='small' placeholder="Lon" value={formatCoord(item[1])} onChange={(e) => handlePolygonVertexChange(index, 1, e.target.value)} />
                            <Button type="text" danger icon={<DeleteOutlined />} disabled={polygonPoints.length <= 3} onClick={() => removePolygonVertex(index)} />
                          </Flex>
                        </Flex>
                      ))}
                      <Button icon={<PlusOutlined />} type='primary' block onClick={addPolygonVertex}>Добавить вершину</Button>
                    </>
                  )}
                </Flex>
              )
            }
          ]}
        />
      </div>

      <Flex gap={10} vertical className={styles.map} style={{ flex: 1, minWidth: '300px' }}>
        <Flex justify='flex-end'>
          <Radio.Group value={activeLayer} onChange={(e) => setActiveLayer(e.target.value)} optionType="button" buttonStyle="solid" size="small">
            <Radio.Button value="2gis">2GIS</Radio.Button>
            <Radio.Button value="YandexScheme">Yandex схема</Radio.Button>
            <Radio.Button value="YandexSat">Yandex спутник</Radio.Button>
            <Radio.Button value="rgis">РГИС</Radio.Button>
          </Radio.Group>
        </Flex>
        <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #d9d9d9' }} />
      </Flex>
    </Flex>
  );
};

export default MapWithLayerSwitcher;