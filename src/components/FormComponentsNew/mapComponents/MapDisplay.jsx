import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import 'antd/dist/reset.css'; 
import { Flex, Radio } from 'antd';

// Импортируем вашу иконку
// Убедитесь, что путь верный относительно этого файла!
import navi from '../../../img/navi.png'; 

// OpenLayers imports
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

// Координаты Москвы
const MOSCOW_LAT = 55.7558;
const MOSCOW_LON = 37.6173;
const DEFAULT_ZOOM = 9;

// Источники тайловых слоёв
// Важно: создаем их один раз вне компонента, чтобы не пересоздавать при ререндерах
const tileSources = {
  '2gis': new TileLayer({
    source: new XYZ({
      url: 'https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}',
      maxZoom: 18,
      attributions: '&copy; <a href="https://2gis.ru">2GIS</a>'
    }),
    visible: true // по умолчанию включён
  }),
  'osm': new TileLayer({
    source: new OSM(),
    visible: false // по умолчанию выключен
  })
};

const MapWithLayerSwitcher = ({ coordinates, setSelectedPoint }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerFeatureRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState('2gis'); // по умолчанию 2GIS

  // Если координаты false — показываем заглушку и переключатель
  if (coordinates === false) {
    return (
      <div style={{ width: '100%' }}>
        <Flex justify="flex-end" style={{ marginBottom: 10 }}>
          <Radio.Group
            value={activeLayer}
            onChange={(e) => setActiveLayer(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="2gis">2GIS</Radio.Button>
            <Radio.Button value="osm">OpenStreetMap</Radio.Button>
          </Radio.Group>
        </Flex>
        <div style={{ 
          width: '100%', 
          height: '400px', 
          backgroundColor: '#f0f2f5', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#666',
          borderRadius: '8px'
        }}>
          Координаты не предоставлены
        </div>
      </div>
    );
  }

  // Проверка формата координат: ожидаем [lat, lon]
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return <div style={{ padding: '10px', color: 'red' }}>Ошибка: координаты должны быть массивом [lat, lon]</div>;
  }

  const [lat, lon] = coordinates;

  // Инициализация карты один раз
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const olCoords = [lon, lat];

    // Создаём маркер с вашей иконкой
    const markerFeature = new Feature({
      geometry: new Point(fromLonLat(olCoords))
    });

    markerFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1], // Привязка по центру низа иконки
          src: navi,        // Используем импортированную картинку
          scale: 0.07,       // Подберите масштаб под размер вашей картинки (0.5 - половина размера)
        })
      })
    );

    markerFeatureRef.current = markerFeature;

    const vectorSource = new VectorSource({
      features: [markerFeature]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        tileSources['2gis'], 
        tileSources['osm'],  
        vectorLayer          
      ],
      view: new View({
        center: fromLonLat([MOSCOW_LON, MOSCOW_LAT]),
        zoom: DEFAULT_ZOOM
      })
    });

    // Обработчик клика по карте
    map.on('click', (event) => {
      const clickedCoord = event.coordinate;
      const [clickedLon, clickedLat] = toLonLat(clickedCoord);

      if (setSelectedPoint) {
        setSelectedPoint([clickedLat, clickedLon]);
      }
    });

    mapInstanceRef.current = map;

    // Очистка при размонтировании
    return () => {
      if (map) {
        map.setTarget(null);
      }
      mapInstanceRef.current = null;
      markerFeatureRef.current = null;
    };
  }, []); // Пустой массив зависимостей = запуск только один раз

  // Обновление только позиции маркера при изменении координат
  useEffect(() => {
    if (!mapInstanceRef.current || !markerFeatureRef.current) return;

    const feature = markerFeatureRef.current;
    const olCoords = [lon, lat];

    // Просто двигаем маркер, карту не трогаем
    feature.setGeometry(new Point(fromLonLat(olCoords)));
  }, [lat, lon]);

  // Переключение видимости слоёв при изменении activeLayer
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Безопасное переключение
    Object.keys(tileSources).forEach(key => {
      if (key === activeLayer) {
        tileSources[key].setVisible(true);
      } else {
        tileSources[key].setVisible(false);
      }
    });
  }, [activeLayer]);

  return (
    <Flex gap={10} vertical style={{ width: '100%' }}>
      <Flex justify='flex-end'>
        {/* Радио-группа справа */}
        <Radio.Group
          value={activeLayer}
          onChange={(e) => setActiveLayer(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="2gis">2GIS</Radio.Button>
          <Radio.Button value="osm">OpenStreetMap</Radio.Button>
        </Radio.Group>
      </Flex>
      
      {/* Контейнер карты */}
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          borderRadius: '8px', 
          overflow: 'hidden',
          border: '1px solid #d9d9d9' 
        }} 
      />
    </Flex>
  );
};

export default MapWithLayerSwitcher;