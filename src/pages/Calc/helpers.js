import calcData from "./calcData.json";

export const prepareDataSource = () => {
  return calcData.sections.reduce((acc, section, sectionIndex) => {
    const sectionItems = section.items
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item, itemIndex) => ({
        key: `${sectionIndex}-${itemIndex}`,
        name: item.name,
        value: item.defaultValue,
        count: 1,
        unit: item.unit || item.defaultUnit || "Штук",
        unitShort: item.unitShort || item.defaultUnit || "Штук",
        usageCoefficient:
          section.section === "Электроприборы инженерного назначения"
            ? 0.6
            : section.section === "Электроприборы бытового назначения"
            ? 0.3
            : 0.3,
        formula: item.formula,
        description: item.description,
        fixedUnit: !!item.unit,
        consumedPower: 0.0,
      }));
    return [
      ...acc,
      {
        key: `section-${sectionIndex}`,
        section: section.section,
        isSection: true,
      },
      ...sectionItems,
    ];
  }, []);
};

