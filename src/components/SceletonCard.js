import React from "react";
import { Card, Flex } from "antd";

export default function SceletonCard({ width = 250, height = "100%" }) {
  return (
    <Flex wrap="wrap" gap="large">
      {[1, 2, 3].map((Item) => (
        <Card
          key={Item}
          loading={true}
          styles={{ body: { width, height } }}
        ></Card>
      ))}
    </Flex>
  );
}
