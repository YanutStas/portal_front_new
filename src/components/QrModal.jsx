import { QRCode, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

export const QrModal = ({ open, onCancel, value, title }) => {
    const containerRef = useRef(null);
    const [qrSize, setQrSize] = useState(500);

    useEffect(() => {
    if (!open) return;

    const calculateSize = () => {
      if (!containerRef.current) return;
      // Ширина тела модалки с учётом её внутренних отступов
      const width = containerRef.current.clientWidth;
      // Если модалка < 500px → берём 100% её ширины, иначе фиксируем 500px
      setQrSize(Math.min(500, Math.round(width)));
    };

    // 1. Измеряем сразу после монтирования модалки
    requestAnimationFrame(calculateSize);

    // 2. Следим за изменением размера (поворот экрана, ресайз окна, анимация модалки)
    const observer = new ResizeObserver(calculateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [open]);

    return (
        <Modal title={title} open={open} onCancel={onCancel} footer={null} width={550}>
            {/* Контейнер растягивается на всю ширину тела модалки */}
            <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <QRCode
                    errorLevel="H"
                    value={value}
                    size={qrSize}
                    type="svg" // SVG масштабируется без потери качества
                />
            </div>
        </Modal>
    );
};