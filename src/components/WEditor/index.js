import React, { PureComponent } from 'react';
import E from 'wangeditor';

export default class WEditor extends PureComponent {
  componentDidMount() {
    const elem = this.editor;
    const editor = new E(elem);
    // 标题配置
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'table', // 表格
      'undo', // 撤销
      'redo', // 重复
    ];
    // 使用 onchange 函数监听内容的变化
      editor.customConfig.pasteFilterStyle = false;
    editor.customConfig.onchange = (html) => {
      this.props.onChange(html);
    };
    editor.create();
    // 初始化设置内容
    editor.txt.html(this.props.content)
  }
  render() {
    return (
        <div ref={(ref) => { this.editor = ref; }} style={{ textAlign: 'left' }} />
    );
  }
}
