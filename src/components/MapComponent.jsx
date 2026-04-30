import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Icon } from 'ol/style'; // Импортируем Icon
import { fromLonLat } from 'ol/proj';

/**
 * @param {Object[]} coordinates - Массив координат [lon, lat]
 * @param {string} iconUrl - Ссылка на изображение иконки (png, svg и т.д.)
 * @param {number} scale - Масштаб иконки (1 = оригинальный размер)
 * @param {number[]} anchor - Смещение якоря иконки [x, y] в долях от 0 до 1. 
 *                            [0.5, 1] означает, что "ножка" иконки будет точно в точке координат.
 */
const MapComponent = ({
  coordinates,
  iconUrl = 'https://png.pngtree.com/png-vector/20241030/ourmid/pngtree-3d-location-icon-png-image_14163078.png',
  // iconUrl = 'https://openlayers.org/en/latest/examples/data/icon.png',
  scale = 0.15,
  anchor = [0.5, 1]
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  console.log("coordinates", coordinates);

  useEffect(() => {
    if (!coordinates || coordinates.length === 0) return;

    // 1. Инициализация карты
    if (!mapInstanceRef.current) {
      const vectorSource = new VectorSource();

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        // Стиль по умолчанию для слоя
        style: new Style({
          image: new Icon({
            src: iconUrl,
            scale: scale,
            anchor: anchor,
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        }),
      });

      const map = new Map({
        target: mapRef.current,
        layers: [
          // new TileLayer({
          //   source: new OSM(),
          // }),
          new TileLayer({
            source: new XYZ({
              url: "https://tile1.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1.1",
              crossOrigin: "anonymous",
            })
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat(coordinates[0]),
          zoom: 9,
        }),
      });

      mapInstanceRef.current = map;
      map.vectorSourceRef = vectorSource;
    } else {
      // Если карта уже есть, но изменился URL иконки, нужно обновить стиль слоя
      // Примечание: В реальном проекте лучше менять стиль через layer.setStyle(), 
      // но здесь мы полагаемся на то, что иконка обычно постоянна.
      // Если iconUrl меняется динамически, нужно обновить стиль всех фич или слоя.
      const layer = mapInstanceRef.current.getLayers().getArray()[1];
      layer.setStyle(new Style({
        image: new Icon({
          src: iconUrl,
          scale: scale,
          anchor: anchor,
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
        }),
      }));
    }

    // 2. Обновление позиций иконок
    const map = mapInstanceRef.current;
    const source = map.vectorSourceRef;

    source.clear();

    const features = coordinates.map((coord) => {
      const transformedCoord = fromLonLat(coord);
      const pointGeometry = new Point(transformedCoord);

      const feature = new Feature({
        geometry: pointGeometry,
      });

      return feature;
    });

    source.addFeatures(features);

    // 3. Центрирование карты
    if (features.length > 0) {
      const extent = source.getExtent();
      if (extent[0] !== Infinity) {
        map.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          duration: 3000,
          maxZoom: 15, // Иконки требуют большего зума, чем просто точки
        });
      }
    }

    return () => {
      if (map) {
        map.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, iconUrl, scale, anchor]);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent;