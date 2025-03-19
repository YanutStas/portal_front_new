import { useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import calcData from "../pages/Calc/calcData.json";

const usageCoefficients = {
  "Электроприборы инженерного назначения": 0.6,
  "Электроприборы бытового назначения": 0.3,
  "Прочие электроприборы": 0.3,
};

export default function useCalc() {
  const [totalPower, setTotalPower] = useState(0);
  const [animation, setAnimation] = useState(null);
  const [calculatedData, setCalculatedData] = useState({});
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const handleFinish = (values) => {
    let total = 0;
    const newCalculatedData = {};

    calcData.sections.forEach((section, sectionIndex) => {
      section.items.forEach((item, itemIndex) => {
        const key = `${sectionIndex}-${itemIndex}`;
        const inputValue = parseFloat(values[key].value);
        const countValue = parseInt(values[key].count, 10) || 0;
        const usageCoefficient =
          parseFloat(values[key].usageCoefficient) ||
          usageCoefficients[section.section] ||
          0.3;

        const formula = item.formula;

        if (!isNaN(inputValue) && formula && countValue > 0) {
          // Подставляем все переменные в формулу
          const expr = formula
            .replace("count", countValue)
            .replace("value", inputValue)
            .replace("usageCoefficient", usageCoefficient);

          // Выполняем формулу
          const result = eval(expr);
          const consumedPower = result; // теперь formula уже учитывает usageCoefficient

          total += consumedPower;
          newCalculatedData[key] = {
            consumedPower: consumedPower.toFixed(2),
            usageCoefficient: usageCoefficient.toFixed(2),
          };
        }
      });
    });

    setAnimation({
      Children: { value: total, floatLength: 2, formatMoney: false },
      duration: 3000,
    });

    setTotalPower(`${total.toFixed(2)} кВт`);
    setCalculatedData(newCalculatedData);
    setShowAdditionalInfo(true);
  };

  const generatePDF = (dataSource, totalPower) => {
    const tableData = dataSource
      .filter((item) => !item.isSection)
      .map((item) => [
        item.name,
        item.value.toFixed(2),
        item.count.toFixed(0),
        item.unit,
        item.usageCoefficient.toFixed(2),
        calculatedData[item.key]?.consumedPower || "0.00",
      ]);

    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    const docDefinition = {
      content: [
        { text: 'АО "Мособлэнерго"', style: "header" },
        {
          text: "Калькулятор оценочного расчета электрической мощности",
          style: "header",
        },
        {
          text: "Калькулятор мощности позволяет оценить совокупную мощность электрооборудования индивидуального домохозяйства (объекта с бытовым характером нагрузки), необходимую для технологического присоединения к электросети АО `Мособлэнерго`.",
          style: "subheader",
        },
        {
          text: "Для заявителей - физических лиц. Только для некоммерческого применения.",
          bold: true,
        },
        {
          text: `Дата и время расчета: ${formattedDate} ${formattedTime}`,
          style: "subheader",
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto", "auto", "auto"],
            body: [
              [
                "Название",
                "Мощность (кВт)",
                "Количество",
                "Единица измерения",
                "Коэффициент использования",
                "Требуемая мощность (кВт)",
              ],
              ...tableData,
            ],
          },
        },
        {
          text: [
            `Итого требуемая электрическая мощность (оценочно): ${totalPower}`,
            { text: "*", superscript: true },
          ],
          style: "total",
          margin: [0, 0, 0, 10],
        },
        {
          text: "* Для точного расчета необходимой мощности, рекомендуем обратиться в специализированные проектные организации.",
          fontSize: 10,
          margin: [0, 0, 0, 0],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          margin: [0, 0, 0, 10],
        },
        total: {
          fontSize: 14,
          margin: [0, 10, 0, 0],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download("Калькулятор мощности.pdf");
  };

  return {
    totalPower,
    animation,
    calculatedData,
    handleFinish,
    showAdditionalInfo,
    generatePDF,
  };
}
