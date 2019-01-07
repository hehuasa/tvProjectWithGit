import React, { PureComponent } from 'react';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

export default class CommonTree extends PureComponent {
  state = {
    autoExpandParent: true,
    expandedKeys: this.props.expandedKeys,
    checkedKeys: this.props.checkedKeys,
    selectedKeys: [],
  };
  onExpand = (expandedKeys) => {
    const { onExpand } = this.props;
    this.setState({
      autoExpandParent: false,
      expandedKeys,
    });
    // onExpand(arguments, expandedKeys);
  };
  onCheck = (checkedKeys, e) => {
    const { onCheck } = this.props;
    this.setState({ checkedKeys });
    // 将参数传回父级组件
    onCheck(checkedKeys, e);
  };
  onSelect = (selectedKeys, info) => {
    const { onSelect } = this.props;
    onSelect(selectedKeys, info);
  };
  // treeList： 1.list数据  2.topParent：父节点是此值时 作为顶级节点 3.parentCode：父节点的字段名
  makeTree = (treeList, topParent, parentCode, keyPropertyName) => {
    const filters = treeList.filter(c => c[parentCode] === topParent);
    if (filters.length) {
      filters.forEach((c) => {
        c.children = this.makeTree(treeList, c[keyPropertyName], parentCode, keyPropertyName);
      });
    }
    return filters;
  };
  renderTreeNodes = (treeList, titlePropertyName, keyPropertyName, nodeKey) => {
    return treeList.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item[titlePropertyName]} key={item[nodeKey]} value={item[nodeKey]} dataRef={item}>
            {this.renderTreeNodes(item.children, titlePropertyName, keyPropertyName, nodeKey)}
          </TreeNode>
        );
      }
      return <TreeNode title={item[titlePropertyName]} value={item[nodeKey]} key={item[nodeKey]} dataRef={item} />;
    });
  };
  // 1. treeList: list结构数据 2.topParent：顶层树的父级节点值 3.parentCode：父节点属性名
  // 4.titlePropertyName：树节点title的属性名 5.keyPropertyName：节点key的属性名
  renderTree = (treeList, topParent, parentCode, titlePropertyName, keyPropertyName, nodeKey) => {
    const treeData = this.makeTree(treeList, topParent, parentCode, keyPropertyName);
    return this.renderTreeNodes(treeData, titlePropertyName, keyPropertyName, nodeKey);
  };
  render() {
    const { treeList, topParent, parentCode, titlePropertyName, keyPropertyName, checkStrictly, nodeKey } = this.props;
    return (
      <Tree
        checkable
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        defaultExpandAll
        onCheck={this.onCheck}
        checkedKeys={this.props.checkedKeys}
        onSelect={this.onSelect}
        checkStrictly={!!checkStrictly}
        selectedKeys={this.state.selectedKeys}
      >
        {this.renderTree(treeList, topParent, parentCode, titlePropertyName, keyPropertyName, nodeKey)}
      </Tree>
    );
  }
}
