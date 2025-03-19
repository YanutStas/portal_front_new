import React from "react";
import { Typography } from "antd";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

const { Paragraph } = Typography;

export default function StrapiRichText({ content }) {
  // Если content - строка, просто отображаем её в Paragraph
  if (typeof content === "string") {
    return <Paragraph>{content}</Paragraph>;
  }

  // Если content - массив строк, отображаем каждую строку в отдельном Paragraph
  if (
    Array.isArray(content) &&
    content.every((item) => typeof item === "string")
  ) {
    return (
      <>
        {content.map((text, index) => (
          <Paragraph key={index}>{text}</Paragraph>
        ))}
      </>
    );
  }

  // Если content - это сложная структура блоков, которую обычно ожидает BlocksRenderer
  if (
    Array.isArray(content) &&
    content.every((item) => typeof item === "object")
  ) {
    return (
      <BlocksRenderer
        blocks={{
          paragraph: ({ children }) => <Paragraph>{children}</Paragraph>,
          // ...другие типы блоков, если они есть
        }}
        content={content}
      />
    );
  }
  return null;
}
