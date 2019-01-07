import React, { PureComponent } from 'react';
import { connect } from 'dva';
import CommonTree from '../../../components/Tree/CommonTree';

export default class Test extends PureComponent {
  treeList=[
    { id: 0, title: '0-0', pid: '0', key: '0-0' },
    { id: 1, title: '0-0-1', pid: '0-0', key: '0-0-1' },
    { id: 2, title: '0-0-2', pid: '0-0', key: '0-0-2' },
    { id: 2, title: '0-1', pid: '0', key: '0-1' },
    { id: 2, title: '0-1-1', pid: '0-1', key: '0-1-1' },
    { id: 2, title: '0-1-1', pid: '0-1', key: '0-1-2' },
  ];
  expandedKeys = ['0-0'];
  onExpand = (expandedKeys) => {
    console.log('onExpand---', arguments);
    console.log('onExpand---', expandedKeys);
  }
  onCheck = (checkedKeys) => {
    console.log('onCheck---', checkedKeys);
  }
  onSelect = (selectedKeys, info) => {
    console.log('onSelect---', info);
  }
  render() {
    return (
      <CommonTree
        treeList={this.treeList}
        topParent="0"
        parentCode="pid"
        titlePropertyName="title"
        keyPropertyName="key"
        onExpand={this.onExpand}
        onCheck={this.onCheck}
        onSelect={this.onSelect}
        autoExpandParent
        expandedKeys={this.expandedKeys}
      />
    );
  }
}
