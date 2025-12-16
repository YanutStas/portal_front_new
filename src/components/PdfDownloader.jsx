import React from 'react';
// import { Download } from 'lucide-react';
import { FilePdfOutlined } from '@ant-design/icons'; // или используйте другую библиотеку иконок
import { Button, Flex } from 'antd';

const PdfDownloader = ({ base64String, fileName = 'report.pdf' }) => {
  const downloadPdf = () => {
    if (!base64String) {
      console.error('Base64 string is empty');
      return;
    }

    try {
      // Убедимся, что строка base64 корректна (удалим возможный префикс data URL)
      const cleanBase64 = base64String.replace(/^data:application\/pdf;base64,/, '');

      // Преобразуем base64 в blob
      const byteCharacters = atob(cleanBase64);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Создаем временную ссылку для скачивания
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Очищаем
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
 
  return (
    <Flex justify='center' style={{margin:10}}>

      <Button
      style={{fontSize:16}}
        type='primary'
        icon={<FilePdfOutlined />}
        onClick={downloadPdf}
        disabled={!base64String}
      // className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {/* <Download className="w-5 h-5 mr-2" /> */}

        Скачать PDF
      </Button>
    </Flex>
  );
};

export default PdfDownloader;