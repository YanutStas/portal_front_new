import React from 'react';
import { Tree, Typography } from 'antd';
import { highlightText } from '../../utils/searchUtils';

const { DirectoryTree } = Tree;
const { Text } = Typography;

export const ServiceTree = ({
    treeData,
    expandedKeys,
    autoExpandParent,
    onSelect,
    onExpand,
    isAiMode,
    searchValue,
    emptyText
}) => {
    const titleRender = (node) => {
        return !isAiMode ? highlightText(node.title, searchValue) : node.title;
    };

    return (
        <DirectoryTree
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            selectable
            showIcon={false}
            style={{ background: 'transparent' }}
            titleRender={titleRender}
            emptyText={
                <Text type="secondary">
                    {isAiMode ? "🤖 ИИ не нашёл подходящих услуг" : "Ничего не найдено"}
                </Text>
            }
        />
    );
};