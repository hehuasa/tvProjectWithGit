import React, { PureComponent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'dva';
import { Button, Input, Layout, Table, Select } from 'antd';
import { registerNode } from './lib/customResgister';
import styles from './index.less';

const { Option } = Select;
registerNode(); // 注册节点
const { Header, Content, Sider } = Layout;
const { G6_1 } = window;
const editor = { };
// 颜色变量
const colorObj = {
  text1: '#48fd3d',
  text2: '#f7e541',
  text3: '#d9d9d9',
  text4: '#000',
  line1: '#f9000e',
  line5: '#f7000f',
  line2: '#d9d9d9',
  line3: '#f7e541',
  line4: '#48fd3d',
  arrow1: '#e8e8e8',
};

@connect(({ flow }) => {
  return {
    flow,
    functionMenus: flow.functionMenus,
  };
})
export default class Canvas extends PureComponent {
  state = {
    showList: true,
    isCreate: false,
    createNode: {},
    currentModel: {},
    currentResource: {
      graphicsName: '',
      remark: '',
    },
    // 组态图列表
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      }, {
        title: '名称',
        dataIndex: 'resourceName',
        key: 'resourceName',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        key: 'action',
        render: (record) => {
          return this.judgeFunction('编辑权限') ? (
            <span>
              <a
                title="edit"
                onClick={(e) => {
          this.handleEdit(e, record);
        }}
              >编辑
              </a>
            </span>
          ) : null;
        },
      },
    ],
  };
  componentDidMount() {
    const { dispatch } = this.props;
    this.getFunctionMenus();
    // 请求抽象资源列表
    dispatch({
      type: 'flow/fetchGraphicList',
      payload: { ctrlType: '901.901' },
    });
    // 请求组态图列表
    dispatch({
      type: 'flow/fetchList',
    });
    dispatch({
      type: 'flow/getByClassifyType',
      payload: { classifyType: '外部系统' },
    });
    document.addEventListener('dragover', (event) => {
      event.preventDefault();
    }, false);
  }
  // 注册画布
  registerNet = (record) => {
    editor.net = new G6_1.Net({
      container: this.editor,
      height: 800,
      width: 1200,
      mode: 'edit',
      // grid: null,
      grid: {
        forceAlign: true, // 是否支持网格对齐
        cell: 10, // 网格大小
        line: { // 网格线样式
          stroke: '#333',
        },
      },
    });
    // 提取画布内容
    if (record.item.graphicsContent) {
      const { source } = JSON.parse(record.item.graphicsContent);
      for (const edge of source.edges) {
        // 临时对深色箭头的样式处理
        if (edge.shape === 'lineNewArrow1') {
          edge.size = 2;
        }
        if (edge.color) {
          if (edge.color === '#7f0003') {
            edge.color = '#f9000e';
            edge.size = 2;
          }
        }
      }
      editor.net.source(source);
    }
    editor.net.render();
    // 鼠标移动事件， 用于新增node时的触发
    editor.net.on('mousemove', (ev) => {
      const { isCreate, createNode } = this.state;
      if (isCreate) {
        switch (createNode.type) {
          // 节点
          case 'node':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              fill: '#202121',
              textFill: colorObj.text3,
              stroke: colorObj.text3,
              shape: 'customNode1',
              size: [80, 80],
              beforeSize: [80, 80],
              fontSize: 14,
              label: createNode.label,
            });
            break;
          // 装置
          case 'node1':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              fill: 'l (0) 0:#373737 0.45:#f3f3f3 0.49:#fff 0.51:#fff 0.55:#f3f3f3 1:#373737',
              textFill: colorObj.text4,
              stroke: colorObj.text3,
              shape: 'customNode2',
              size: [80, 80],
              beforeSize: [80, 80],
              fontSize: 18,
              label: createNode.label,
              fontFamily: '宋体',
              fontWeight: 800,
            });
            break;
          case 'node1-1':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              fill: 'l (0) 0:#373737 0.45:#f3f3f3 0.49:#fff 0.51:#fff 0.55:#f3f3f3 1:#373737',
              textFill: colorObj.text4,
              stroke: colorObj.text3,
              shape: 'customNode2-1',
              size: [80, 100],
              beforeSize: [80, 80],
              fontSize: 18,
              label: createNode.label,
              fontFamily: '宋体',
              fontWeight: 800,
            });
            break;
          // 梯形
          case 'node2':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              stroke: colorObj.line1,
              shape: 'customNode3',
            });
            break;
          // 箭头
          case 'node3':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              stroke: colorObj.line1,
              shape: 'customNode4',
            });
            break;
          case 'node3-1':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              stroke: colorObj.line1,
              shape: 'customNode4-1',
            });
            break;
          // 异形1
          case 'node4':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              stroke: colorObj.line1,
              shape: 'customNode5',
            });
            break;
          // 异形2
          case 'node5':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              stroke: colorObj.line1,
              shape: 'customNode6',
            });
            break;
          // 异形3
          case 'node6':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              stroke: colorObj.line5,
              shape: 'customNode7',
            });
            break;
          // 异形4
          case 'node7':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              stroke: colorObj.line5,
              shape: 'customNode8',
            });
            break;
            // 辅助
          case 'node-1':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              fill: 'rgba(0,0,0,0)',
              textFill: colorObj.text3,
              stroke: 'rgba(0,0,0,0)',
              shape: 'customNode1',
              size: [80, 80],
              beforeSize: [80, 80],
              fontSize: 14,
            });
            break;
          // 标题
          case 'title':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              stroke: colorObj.text1,
              textFill: colorObj.text1,
              shape: 'customText',
              fontSize: 36,
              label: createNode.label,
            });
            break;
          // 文本
          case 'text':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              stroke: colorObj.text3,
              textFill: colorObj.text3,
              shape: 'customText',
              fontSize: 14,
              label: createNode.label,
            });
            break;
          // 主线条
          case 'line':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              size: [200, 5],
              stroke: colorObj.line2,
              lineSize: 5,
              shape: 'customLine',
            });
            break;
          case 'lineWithCircle':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              size: [200, 5],
              r: 20,
              stroke: colorObj.line2,
              shape: 'customLineWithCircle',
            });
            break;
          // 主线条（垂直）
          case 'lineV':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              size: [5, 200],
              stroke: colorObj.line2,
              lineSize: 5,
              shape: 'customLineV',
            });
            break;
          case 'lineWithCircleV':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              size: [5, 200],
              r: 20,
              stroke: colorObj.line2,
              shape: 'customLineWithCircleV',
            });
            break;
          case 'K201':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              shape: 'K201',
            });
            break;
          case 'K501':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              shape: 'K501',
            });
            break;
          case 'K601':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              shape: 'K601',
            });
            break;
          case 'K760':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              shape: 'K760',
            });
            break;
          // 虚线
          case 'dash':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              size: [50, 2],
              stroke: colorObj.line4,
              shape: 'customDashLine',
            });
            break;
          // 虚线（垂直）
          case 'dashV':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              size: [2, 50],
              stroke: colorObj.line4,
              shape: 'customDashLineV',
            });
            break;
          // 分割线
          case 'splitLine':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              stroke: colorObj.line3,
              shape: 'splitLine',
            });
            break;
          // 指标
          case 'quota':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              size: [80, 80],
              quotaName: '指标名',
              quotaValue: '0',
              quotaNameTextFill: colorObj.text3,
              quotaNameFontSize: 14,
              quotaValueTextFill: colorObj.text2,
              quotaValueFontSize: 12,
              otherSystemCode: '0',
              device: 1,
              remark: '备注',
              shape: 'quotaRect',
            });
            break;
          case 'quotaH':
            editor.net.add('node', {
              x: ev.x,
              y: ev.y,
              size: [80, 80],
              quotaName: '指标名',
              quotaValue: '0',
              quotaNameTextFill: colorObj.text3,
              quotaNameFontSize: 14,
              quotaValueTextFill: colorObj.text2,
              quotaValueFontSize: 12,
              otherSystemCode: '0',
              device: 1,
              remark: '备注',
              shape: 'quotaRectH',
            });
            break;
          default: break;
        }
        this.setState({ isCreate: false });
      }
    });
    editor.net.on('itemclick', (e) => {
      // 获取被点击的节点属性，用于编辑
      const model = e.item.getModel();
      this.setState({ currentModel: JSON.parse(JSON.stringify(model)) });
      return false;
    });
    editor.net.removeBehaviour('resizeEdge');
  };
  // 新增节点时，获取与存储节点类型
  handleDrag = (e) => {
    e.dataTransfer.setData('label', e.target.innerHTML);
    e.dataTransfer.setData('type', e.target.title);
  };
  // 新增节点拖动至画布时，获取节点类型
  handleDrop = (e) => {
    const label = e.dataTransfer.getData('label');
    const type = e.dataTransfer.getData('type');
    this.setState({ isCreate: true, createNode: { label, type } });
  };
  // 连线
  tools = (e) => {
    switch (e.target.title) {
      // 自定义箭头的直线1
      case 'line':
        editor.net.beginAdd('edge', {
          shape: 'lineNewArrow',
          color: '#f9000e',
        });
        break;
      // 自定义箭头的直线2
      case 'lineWithNewArrow':
        editor.net.beginAdd('edge', {
          shape: 'lineNewArrow1',
          color: '#f9000e',
        });
        break;
      case 'lineNewArrowWithAngel':
        editor.net.beginAdd('edge', {
          shape: 'lineNewArrowWithAngel',
          color: '#f9000e',
        });
        break;
      case 'strengthLine':
        editor.net.beginAdd('edge', {
          shape: 'strengthLine',
          color: colorObj.line2,
        });
        break;
        // 虚线
      case 'smooth':
        editor.net.beginAdd('edge', {
          shape: 'smoothArrow',
        });
        break;
      // 折线
      case 'polyLine':
        editor.net.beginAdd('edge', {
          shape: 'polyLineFlow',
        });
        break;
      // 连线后，需要切换回默认模式
      case 'defaultMode':
        editor.net.changeMode('default');
        break;
      // 编辑模式
      case 'editMode':
        editor.net.changeMode('edit');
        break;
      // 复制
      case 'copy':
        editor.net.copy();
        break;
      // 粘贴
      case 'paste':
        editor.net.paste();
        break;
      default: break;
    }
  };
  // 保存
  saveFlow = (e) => {
    switch (e.target.title) {
      case 'save': {
        const { currentResource } = this.state;
        const data = editor.net.save();
        const obj = {
          resourceID: currentResource.resourceID,
          deviceStatuGraphicsID: currentResource.deviceStatuGraphicsID,
          graphicsName: currentResource.graphicsName,
          // graphicsContent: JSON.stringify(data),
          pointStr: [],
          remark: currentResource.remark,
        };
        const newNodes = [];
        for (const node of data.source.nodes) {
          if (parseFloat(node.x) < 5000 || parseFloat(node.y) < 5000) {
            newNodes.push(node);
          }
          if (node.device) {
            obj.pointStr.push({
              pointCode: node.device,
              // otherSystemCode: node.otherSystemCode,
              otherSystemCode: node.otherSystemCode ? '901.101.101' : '',
              remark: node.remark || '',
            });
          }
        }
        data.source.nodes = newNodes;
        obj.graphicsContent = JSON.stringify(data);
        obj.pointStr = JSON.stringify(obj.pointStr);
        this.props.dispatch({
          type: 'flow/save',
          payload: obj,
        }).then(() => {
          this.props.dispatch({
            type: 'flow/fetchList',
          });
          this.setState({ showList: true });
        });
      }
        break;
      case 'cancel':
        this.setState({ showList: true });
        // editor.net.destroy();
        // editor.net = undefined;
        break;
      default: break;
    }
  };
  // 处理流程名、备注
  handleName = (e) => {
    const { title, value } = e.target;
    const { currentResource } = JSON.parse(JSON.stringify(this.state));
    currentResource[title] = value;
    this.setState({ currentResource });
  };
  // 编辑
  handleEdit = (e, record) => {
    // 关闭列表
    this.setState({ showList: false });
    // 存储流程数据
    this.setState({ currentResource: record.item });
    setTimeout(() => {
      // 初始化画布
      if (editor.net === undefined) {
        this.registerNet(record);
      } else {
        // 提取画布内容
        if (record.item.graphicsContent) {
          const { source } = JSON.parse(record.item.graphicsContent);
          // 提取画布内容
          if (record.item.graphicsContent) {
            for (const edge of source.edges) {
              // 临时对深色箭头的样式处理
              if (edge.shape === 'lineNewArrow1') {
                edge.size = 2;
              }
              if (edge.color) {
                if (edge.color === '#7f0003') {
                  edge.color = '#f9000e';
                  edge.size = 2;
                }
              }
            }
            for (const node of source.nodes) {
              // 临时对深色样式处理
                if (node.fill) {
                  if (node.fill === '#7f0003') {
                    node.fill = '#f9000e';
                  }
                }
              if (node.stroke) {
                if (node.stroke === '#7f0003') {
                  node.stroke = '#f9000e';
                }
              }
            }
          }
          editor.net.changeData(source);
        }
      }
    }, 100);
  };
  // 编辑属性
  changeCurrentRect = (e, evt) => {
    this.saveFlow({ target: { title: 'save ' } });
    // 判断有无 .target属性
    let title;
    let value;
    if (e.target) {
      title = e.target.title;
      value = e.target.value;
    } else {
      title = evt.props.title;
      value = e;
    }
    const { id } = this.state.currentModel;
    const item = editor.net.find(id);
    const model = JSON.parse(JSON.stringify(item.getModel()));
    // 针对size 特殊处理
    if (title === 'size0') {
      model.size[0] = Number(value);
    } else if (title === 'size1') {
      model.size[1] = Number(value);
    } else {
      model[title] = value;
    }
    editor.net.update(id, model);
    // editor.net.refresh();
    this.setState({ currentModel: model });
    this.saveFlow({ target: { title: 'save ' } });
  };
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'flow/getFunctionMenus',
      payload: { parentCode: functionInfo.functionCode },
    });
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { functionMenus } = this.props;
    const arr = functionMenus.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  render() {
    const { graphicList, list, classifyType } = this.props.flow;
    const { currentModel, showList, columns, currentResource } = this.state;
    const data = [];
    for (const [index, value] of graphicList.entries()) {
      const item = list.filter(graphic => graphic.resourceID === value.resourceID)[0];
      data.push({ key: index, resourceName: value.resourceName, remark: item ? item.remark : '', item: item || { resourceID: value.resourceID } });
    }
    return (
      <div className={styles.warp}>
        <div style={{ zIndex: showList ? 10 : -1 }} className={styles.content} ref={ref => this.test = ref}>
          <h2>流程列表</h2>
          <Table columns={columns} dataSource={data} />
        </div>
        <Layout style={{ zIndex: showList ? -1 : 10 }} className={styles.content}>
          <Header style={{ background: '#e4e9ee' }}>
            <div className={styles.header}>
              <div onClick={this.tools}>
                <Button title="line" shape="circle" icon="arrow-right" />
                <Button title="lineWithNewArrow" shape="circle" icon="arrow-right" />
                <Button title="lineNewArrowWithAngel" shape="circle" icon="arrow-right" />
                <Button title="strengthLine" shape="circle" icon="arrow-right" />
                <Button title="smooth" shape="circle" icon="rollback" />
                <Button title="polyLine" shape="circle" icon="enter" />
                <Button title="copy">复制</Button>
                <Button title="paste">粘贴</Button>
                <Button title="defaultMode">默认模式</Button>
                <Button title="editMode">编辑模式</Button>
              </div>
              <div className={styles.save}>
                <Input
                  style={{ width: 150 }}
                  className={styles.input}
                  title="graphicsName"
                  value={currentResource.graphicsName}
                  onChange={this.handleName}
                  placeholder="组态图名"
                />
                <Input
                  style={{ width: 300, marginLeft: 16 }}
                  className={styles.input}
                  title="remark"
                  value={currentResource.remark}
                  onChange={this.handleName}
                  placeholder="备注"
                />
                <div onClick={this.saveFlow}>
                  <Button title="save" type="primary">保存</Button>
                  <Button title="cancel" type="danger">取消</Button>
                </div>
                {/* <Input.Search */}
                {/* style={{ width: 100 }} */}
                {/* className={styles.input} */}
                {/* placeholder="组态图名" */}
                {/* enterButton="保存" */}
                {/* value={currentResource.graphicsName} */}
                {/* onChange={this.handleName} */}
                {/* onSearch={this.saveFlow} */}
                {/* /> */}
              </div>
            </div>
          </Header>
          <Layout>
            <Sider>
              <Scrollbars
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
              >
                <div className={styles['left-side']} onDragStart={this.handleDrag}>
                  <div draggable title="title">标题</div>
                  <div draggable title="text">文字</div>
                  <div draggable title="node">装置</div>
                  <div draggable title="node1">装置（渐变）</div>
                  <div draggable title="node1-1">装置（渐变1）</div>
                  <div draggable title="node-1">辅助</div>
                  <div draggable title="quota">指标</div>
                  <div draggable title="quotaH">指标(横)</div>
                  <div draggable title="node2">梯形</div>
                  <div draggable title="node3">箭头</div>
                  <div draggable title="node3-1">箭头(反向)</div>
                  <div draggable title="node4">异形1</div>
                  <div draggable title="node5">异形2</div>
                  <div draggable title="node6">异形3</div>
                  <div draggable title="node7">异形4</div>
                  <div draggable title="line">直线（横）</div>
                  <div draggable title="lineV">直线（竖）</div>
                  <div draggable title="lineWithCircle">直线（横,圆点）</div>
                  <div draggable title="lineWithCircleV">直线（竖,圆点）</div>
                  <div draggable title="dash">虚线（横）</div>
                  <div draggable title="dashV">虚线（竖）</div>
                  <div draggable title="splitLine">分割线</div>
                  <div draggable title="K201">K201</div>
                  <div draggable title="K501">K501</div>
                  <div draggable title="K601">K601</div>
                  <div draggable title="K760">K760</div>
                </div>
              </Scrollbars>
            </Sider>
            <Content>
              <div className={styles.canvas} onDrop={this.handleDrop} ref={(ref) => { this.editor = ref; }} />
            </Content>
            <Sider>
              <h3 style={{ textAlign: 'center' }}>属性编辑</h3>
              <div className={styles.edit}>
                {currentModel.color !== undefined ? (
                  <div>
                    <span>颜色：</span><Input value={currentModel.color} size="small" title="color" onChange={this.changeCurrentRect} />
                  </div>
                  ) :
                  null
                }
                {currentModel.label !== undefined ? (
                  <div>
                    <span>名称：</span><Input value={currentModel.label} size="small" title="label" onChange={this.changeCurrentRect} />
                  </div>
) :
            null
          }
                {currentModel.x !== undefined ? (
                  <div>
                    <span>X：</span><Input type="number" size="small" value={currentModel.x} title="x" onChange={this.changeCurrentRect} />
                  </div>
            ) :
            null
          }
                {currentModel.y !== undefined ? (
                  <div>
                    <span>Y：</span><Input type="number" size="small" value={currentModel.y} title="y" onChange={this.changeCurrentRect} />
                  </div>
            ) :
            null
          }
                {currentModel.size !== undefined ? (
                  <div>
                    <span>宽：</span><Input type="number" size="small" value={currentModel.size ? currentModel.size[0] : ''} title="size0" onChange={this.changeCurrentRect} />
                  </div>
) :
            null
          }
                {currentModel.size !== undefined ? (
                  <div>
                    <span>高：</span><Input value={currentModel.size ? currentModel.size[1] : ''} size="small" title="size1" onChange={this.changeCurrentRect} />
                  </div>
) :
            null
          }
                {currentModel.textFill !== undefined ? (
                  <div>
                    <span>文字色：</span><Input value={currentModel.textFill} size="small" title="textFill" onChange={this.changeCurrentRect} />
                  </div>
) :
            null
          }
                {currentModel.fontSize !== undefined ? (
                  <div>
                    <span>文字尺寸：</span><Input value={currentModel.fontSize} size="small" title="fontSize" onChange={this.changeCurrentRect} />
                  </div>
) :
            null
          }
                {currentModel.fill !== undefined ? (
                  <div>
                    <span>填充色：</span><Input value={currentModel.fill} size="small" title="fill" onChange={this.changeCurrentRect} />
                  </div>
) :
            null
          }
                {currentModel.stroke !== undefined ? (
                  <div>
                    <span>边框色：</span><Input value={currentModel.stroke} size="small" title="stroke" onChange={this.changeCurrentRect} />
                  </div>
) :
            null
          }
                {currentModel.label !== undefined ? (
                  <div>
                    <span>线条颜色：</span><Input value={currentModel.stroke} size="small" title="stroke" onChange={this.changeCurrentRect} />
                  </div>
) :
            null
          }
                {currentModel.lineWidth !== undefined ? (
                  <div>
                    <span>线宽：</span><Input value={currentModel.lineWidth} size="small" title="lineWidth" onChange={this.changeCurrentRect} />
                  </div>
) :
            null
          }
                {currentModel.lineSize !== undefined ? (
                  <div>
                    <span>线宽：</span><Input value={currentModel.lineSize} size="small" title="lineSize" onChange={this.changeCurrentRect} />
                  </div>
                  ) :
                  null
                }
                {currentModel.lineLength !== undefined ? (
                  <div>
                    <span>线长：</span><Input value={currentModel.lineLength} size="small" title="lineLength" onChange={this.changeCurrentRect} />
                  </div>
) :
            null
          }
                {currentModel.quotaName !== undefined ? (
                  <div>
                    <span>指标名称：</span>
                    <Input value={currentModel.quotaName} size="small" title="quotaName" onChange={this.changeCurrentRect} />
                  </div>
) :
            null
          }
                {currentModel.device !== undefined ? (
                  <div>
                    <span>对应位号：</span>
                    <Input value={currentModel.device} size="small" title="device" onChange={this.changeCurrentRect} />
                  </div>
) :
            null
          }
                {!currentModel.otherSystemCode !== undefined ? (
                  <div>
                    <span>系统编码：</span>
                    <Select value="901.101.101" style={{ width: 120 }} onChange={this.changeCurrentRect}>
                      <Option value="0">请选择</Option>
                      { classifyType.map(item =>
                        <Option value={item.ctrlTypeCode} key={item.resourceCtrlTypeID} title="otherSystemCode">{item.typeName}</Option>
                      )}
                    </Select>
                  </div>
            ) : (
             null
)}
                {currentModel.remark !== undefined ? (
                  <div>
                    <span>描述：</span>
                    <Input value={currentModel.remark} size="small" title="remark" onChange={this.changeCurrentRect} />
                  </div>
            ) :
            null
          }
              </div>
            </Sider>
          </Layout>
        </Layout>
      </div>
    );
  }
}
