import React from 'react';
import { Tree } from 'antd';

import { service } from '@/configs';

function TreeItem(props) {
  return (
    <Tree checkable expandedKeys={props.expandedKeys} checkedKeys={props.checkedKeys} onSelect={props.onSelect || null} onCheck={props.onCheck || null} selectedKeys={props.selectedKeys} style={{ height: '100%' }} className="menu-tree-wrapper">
      {service.getValue(props, 'dataSource', []).map(item => {
        return (
          <Tree.TreeNode key={service.getValue(item, 'menuId', '')} title={<span className="sub-title">{service.getValue(item, 'menuKoName', '')}</span>} disabled={props.disabled}>
            {service
              .getValue(item, 'subDeph', [])
              .filter(child => service.getValue(child, 'menuId', false) !== 'MENU070402')
              .map(child => {
                return <Tree.TreeNode key={service.getValue(child, 'menuId', '')} disabled={props.disabled} title={service.getValue(child, 'menuKoName', '')} selectable />;
              })}
          </Tree.TreeNode>
        );
      })}
    </Tree>
  );
}

export default TreeItem;
