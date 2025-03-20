import React, { useEffect, useState } from "react";
import { Button, Flex, Tag, ConfigProvider, theme } from "antd";
function arrToObj(arr, field) {
  const object = {};
  arr.forEach((filter) => {
    if (!object.hasOwnProperty(filter[field])) {
      object[filter[field]] = {};
      object[filter[field]].name = filter.name;
      object[filter[field]].value = new Set();
    }
    if (filter.value) object[filter[field]].value.add(filter.value);
  });
  return object;
}

export default function TagFilters({ array, handlerFilter }) {
  const { colorFill } = theme.useToken().token;
  const [listFilters, setListFilter] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  let objectFilters = {};
  const handlerClear = () => {
    setSelectedTags([]);
    handlerFilter([]);
  };

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t.value !== tag.value);

    setSelectedTags(nextSelectedTags);
    const objectForFilter = arrToObj(nextSelectedTags, "component");
    const arrayForFilter = Object.entries(objectForFilter).map((item) => ({
      component: item[0],
      value: Array.from(item[1].value),
    }));

    handlerFilter(arrayForFilter);
  };
  useEffect(() => {
    array.forEach((service) => {
      if (service.attributes.filters) {
        service.attributes.filters.forEach((filter) => {
          if (!objectFilters.hasOwnProperty(filter.__component)) {
            objectFilters[filter.__component] = {};
            objectFilters[filter.__component].name = filter.name;
            objectFilters[filter.__component].sort = filter.sort;
            objectFilters[filter.__component].value = new Set();
          }
          if (filter.value)
            objectFilters[filter.__component].value.add(filter.value);
        });
      }
    });
    setListFilter(
      Object.entries(objectFilters).map((item) => ({
        component: item[0],
        name: item[1].name,
        sort: item[1].sort,
        value: Array.from(item[1].value),
      }))
    );
  }, [array]);
  return (
    <>
      {listFilters.length > 0 && (
        <Button style={{ marginBottom: "20px" }} onClick={handlerClear}>
          Очистить фильтр
        </Button>
      )}
      <br />

      {listFilters
        .sort(function (a, b) {
          if (a.sort > b.sort) {
            return 1;
          }
          if (b.sort > a.sort) {
            return -1;
          }
          return 0;
        })
        .map((item, index) => (
          <Flex
            key={index}
            style={{ marginBottom: "10px" }}
            gap={1}
            wrap="wrap"
            vertical
          >
            <div>
              <span style={{ fontWeight: 700 }}>{item.name}:</span>
            </div>

            <div>
              <ConfigProvider
                theme={{
                  components: {
                    Tag: {
                      defaultBg: "#131313",
                    },
                  },
                }}
              >
                {item.value.map((tag) => (
                  <Tag.CheckableTag
                    style={{
                      padding: "3px 7px",
                      border: `1px solid ${colorFill}`,
                      borderRadius: "10px",
                      marginBottom: "5px",
                    }}
                    key={tag}
                    checked={selectedTags.find((item) => item.value === tag)}
                    onChange={(checked) =>
                      handleChange(
                        { component: item.component, value: tag },
                        checked
                      )
                    }
                  >
                    {tag}
                  </Tag.CheckableTag>
                ))}
              </ConfigProvider>
            </div>
          </Flex>
        ))}
    </>
  );
}
