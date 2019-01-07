import React from 'react';
import { Button, Radio, Collapse, Modal, Input, Checkbox } from 'antd';
import { SketchPicker } from 'react-color';
import { Scrollbars } from 'react-custom-scrollbars';
import PanelHead from './PanelHead';
import { mapMarking } from '../../../utils/mapService';
import { mapConstants } from '../../../services/mapConstant';
import { G6Register } from './register';
import { generateMixed, cloneMarkObj } from '../../../utils/utils';
import circle from '../../../assets/map/mark/圆.png';
import textMark from '../../../assets/map/mark/文字.png';
import box from '../../../assets/map/mark/矩形.png';
import line from '../../../assets/map/mark/直线.png';
import polyLine from '../../../assets/map/mark/折线.png';
import polygon from '../../../assets/map/mark/多边形.png';
import arrow from '../../../assets/map/mark/箭头.png';
import arrowP from '../../../assets/map/mark/箭头折线.png';
import arrowQ from '../../../assets/map/mark/曲线箭头.png';
import jiuhu from '../../../assets/map/mark/jiuhu.png';
import nP from '../../../assets/map/mark/护士.png';
import cP from '../../../assets/map/mark/警察.png';
import fP from '../../../assets/map/mark/消防人员.png';
import dP from '../../../assets/map/mark/医生.png';
import wuzi from '../../../assets/map/mark/wuzhi.png';
import flag from '../../../assets/map/mark/旗帜.svg';
import xiaofang from '../../../assets/map/mark/xiaofang.png';
import styles from './index.less';

const auxiliaryColor0 = 'rgba(0, 0, 0, 0)';
const auxiliaryColor1 = 'rgba(255, 255, 255, .8)';
const { G6 } = window;
const { Panel } = Collapse;
const colorObj = {
  fill: '#fff',
  stroke: 'red',
};
const dragNodes = [
  { id: 'text', name: '文本', src: textMark },
  { id: 'circle', name: '圆形', src: circle },
  { id: 'box', name: '矩形', src: box },
  { id: 'line', name: '直线', src: line },
  { id: 'polyLine', name: '折线', src: polyLine },
  { id: 'polygon', name: '多边形', src: polygon },
  { id: 'arrow', name: '箭头  (曲线)', src: arrowQ },
  { id: 'arrowWithPolyLine', name: '箭头  (折线)', src: arrowP },
  { id: 'flag', name: '旗帜', src: flag },
];
const dragImg = [
  { id: 'jiuhu', name: '救护车', src: jiuhu },
  { id: 'wuzi', name: '物资车', src: wuzi },
  { id: 'xiaofang', name: '消防车', src: xiaofang },
  { id: '医生', name: '医生', src: dP },
  { id: '护士', name: '护士', src: nP },
  { id: '警察', name: '警察', src: cP },
  { id: '消防人员', name: '消防人员', src: fP },
];
const getCustomPanelStyle = (type) => {
  if (type) {
    return {
      borderRadius: 0,
    };
  } else {
    return {
      borderRadius: 0,
      color: '#fff',
    };
  }
};
const delNodes = [];
export default class Mark extends G6Register {
  state = {
    zIndex: 10,
    showColor: false,
    currentColor: { type: '', color: '' },
    createNode: { type: '' },
    layerValue: 'env',
    modalVisible: false,
    currenLineId: '',
    showLayers: false,
    currentTextId: '',
    currentArrow: {
      sourceId: '',
      targetId: '',
      edgeId: '',
    },
    currentTextValue: '',
    currentSelectNode: null,
    currentCopyNode: null,
  };
  componentDidMount() {
    const { markData } = this.props;
    const { layerValue } = this.state;
    const nodes = [...markData.data.filter(value => value.layerType === layerValue)];
    this.graph = new G6.Graph({
      container: this.canvas,
      modes: {
        default: ['drag'],
        add: ['add'],
        edit: ['edit'],
        addCustomPolyLine: ['addCustomPolyLine'],
        addCustomLine: ['addCustomLine'],
        addCustomText: ['addCustomText'],
        editQuadratic: ['editQuadratic'],

      },
      mode: 'default',
    });
    super.registerBehaviour(G6);
    super.registerNode(G6);
    // this.graph.edge({
    //   shape: 'polyline',
    // });
    // 箭头的辅助点，以及模式切换
    this.graph.on('edge:mouseenter', (ev) => {
      if (this.graph.mode === 'editQuadratic') {
        return false;
      }
      const { item } = ev;
      if (item) {
        const model = item.getModel();
        if (model.shape === 'quadraticArrow') {
          const { fill, stroke } = colorObj;
          const { source, target } = model;
          this.setState({ currentArrow: { sourceId: source, targetId: target } });
          this.graph.update(source, {
            fill, stroke,
          });
          this.graph.update(target, {
            fill, stroke,
          });
          this.graph.changeMode('editQuadratic');
        }
      }
    });
    this.graph.on('node:mouseenter', ({ item }) => {
      if (this.graph._cfg.mode !== 'default') {
        return false;
      }
      if (item) {
        const model = item.getModel();
        if (model.shape === 'customLine' || model.shape === 'custom_PolyLine' || model.shape === 'custom_ArrowWithPolyLine') {
          this.graph.update(item, {
            circleColor: 'red',
          });
        }
      }
    });
    this.graph.on('node:mouseleave', ({ item }) => {
      if (this.graph._cfg.mode !== 'default') {
        return false;
      }
      if (item) {
        const model = item.getModel();
        if (model.shape === 'customLine' || model.shape === 'custom_PolyLine' || model.shape === 'custom_ArrowWithPolyLine') {
          this.graph.update(item, {
            circleColor: 'rgba(0,0,0,0)',
          });
        }
      }
    });
    this.graph.on('click', (ev) => {
      if (this.graph._cfg.mode !== 'default' && this.graph._cfg.mode !== 'editQuadratic') {
        return false;
      }
      const { item } = ev;
      const { currentSelectNode } = this.state;
      if (currentSelectNode) {
        const model = currentSelectNode.getModel();
        if (model.auxiliaryColor && model.auxiliaryColor === auxiliaryColor1) {
          this.graph.update(currentSelectNode, {
            auxiliaryColor: auxiliaryColor0,
          });
        }
      }
      if (item) {
        this.setState({
          currentSelectNode: item,
        }, () => {
          const model = item.getModel();
          if (model.auxiliaryColor && model.auxiliaryColor === auxiliaryColor0) {
            this.graph.update(item, {
              auxiliaryColor: auxiliaryColor1,
            });
          }
        });
      }
    });
    this.graph.on('node:dblclick', (ev) => {
      const { item } = ev;
      if (item) {
        const model = item.getModel();
        if (model.shape === 'customTextBox') {
          this.setState({
            modalVisible: true,
            currentTextValue: model.text,
            currentTextId: model.id,
          });
        }
      }
    });
    const edges = [];
    for (const node of nodes) {
      const point = mapConstants.view.toScreen(node.geometry);
      node.x = point.x + 0.5;
      node.y = point.y + 0.5;
    }
    // 是否有箭头
    const hasEdges = nodes.filter(value => value.hasEdge);
    for (const item of hasEdges) {
      const { edge, target, source } = item;
      const newEdge = cloneMarkObj(edge);
      const newTarget = cloneMarkObj(target[0]);
      const newSource = cloneMarkObj(source[0]);
      const mapPoint = mapConstants.view.toScreen(newEdge.geometry);
      newEdge.ct = { x: mapPoint.x, y: mapPoint.y };
      edges.push(newEdge);
      const tPoint = mapConstants.view.toScreen(newTarget.geometry);
      const sPoint = mapConstants.view.toScreen(newSource.geometry);
      newTarget.x = tPoint.x;
      newTarget.y = tPoint.y;
      newSource.x = sPoint.x;
      newSource.y = sPoint.y;
      nodes.push(newTarget, newSource);
      const index = nodes.findIndex(value => (value.edge ? value.edge.id === newEdge.id : false));
      nodes.splice(index, 1);
    }
    this.graph.read({ nodes, edges });
  }
  // 新增节点
  handleNodeAdd = (e) => {
    this.setState({ createNode: { type: e.target.title } }, (() => {
      this.graph.changeMode('add');
    }));
    e.stopPropagation();
  };
  // 点击事件
  handleClick = (e) => {
    const { title } = e.target;
    const { dispatch } = this.props;
    this.graph.changeMode('default');
    if (title) {
      switch (title) {
        case 'save':
          this.handleSave();
          break;
        case 'edit':
          this.graph.changeMode('edit');
          break;
        case 'copy':
          this.setState({
            currentCopyNode: this.state.currentSelectNode,
          });
          break;
        case 'paste':
          {
            const model = this.state.currentCopyNode.getModel();
            model.id = generateMixed(8);
            model.x += 20;
            model.y -= 20;
            this.graph.add('node', model);
          }
          break;
        case 'del':
          if (this.state.currentSelectNode) {
            // 判断是否是曲线箭头
            const model = this.state.currentSelectNode.getModel();
            if (model.shape === 'quadraticArrow') {
              this.graph.remove(model.source);
              this.graph.remove(model.target);
              delNodes.push(model.source);
              delNodes.push(model.target);
            }
            console.log('_cfg', this.state.currentSelectNode);
            this.graph.remove(this.state.currentSelectNode);
            delNodes.push(this.state.currentSelectNode.id);
          }
          break;
        case 'empty':
          this.handleClearLayer();
          break;
        case 'default':
          this.graph.changeMode('default');
          break;
        case 'layers':
          this.setState({ showLayers: !this.state.showLayers }); break;
        case 'back':
          {
            dispatch({
              type: 'mapRelation/showMark',
              payload: { load: true, show: false },
            });
            mapMarking({ type: 'switch', layerType: this.props.markData.type });
            dispatch({
              type: 'mapRelation/showPopup',
              payload: true,
            });
            const markLayer = mapConstants.mainMap.findLayerById('地图标注');
            if (markLayer) {
              markLayer.visible = true;
            }
          }
          break;
        default: break;
      }
    }
    e.stopPropagation();
  };
  // 保存
  handleSave = () => {
    const { dispatch, markData } = this.props;
    const data = this.graph.save();
    const { nodes, edges } = data;
    const newData = { ...markData };
    console.log('newData', newData);
    if (edges) {
      for (const edge of edges) {
        // 获取有边的图形，转为node统一保存
        const sourceIndex = nodes.findIndex(value => value.id === edge.source);
        const source = nodes.splice(sourceIndex, 1);
        const targetIndex = nodes.findIndex(value => value.id === edge.target);
        const target = nodes.splice(targetIndex, 1);
        const color = 'rgba(0,0,0,0)';
        source[0].fill = color;
        source[0].stroke = color;
        target[0].fill = color;
        target[0].stroke = color;
        // 生成新的box
        const minY = Math.min(source[0].y, target[0].y, edge.ct.y);
        const minX = Math.min(source[0].x, target[0].x, edge.ct.x);
        const box = {
          minY: Math.min(source[0].y, target[0].y, edge.ct.y),
          minX: Math.min(source[0].x, target[0].x, edge.ct.x),
          maxY: Math.max(source[0].y, target[0].y, edge.ct.y),
          maxX: Math.max(source[0].x, target[0].x, edge.ct.x),
        };
        // 地理信息先行存储（用于编辑时重设坐标）
        source[0].geometry = mapConstants.view.toMap({ x: source[0].x - 0.5, y: source[0].y - 0.5 });
        target[0].geometry = mapConstants.view.toMap({ x: target[0].x - 0.5, y: target[0].y - 0.5 });
        edge.geometry = mapConstants.view.toMap({ x: edge.ct.x - 0.5, y: edge.ct.y - 0.5 });
        // 矫正新生成小画布后的起始点坐标
        source[0].x -= minX;
        source[0].y -= minY;
        target[0].x -= minX;
        target[0].y -= minY;

        edge.ct.y -= minY;
        edge.ct.x -= minX;
        box.width = box.maxX - box.minX;
        box.height = box.maxY - box.minY;
        const obj = {
          getBBox: () => box,
          edge,
          id: edge.id,
          source,
          target,
          hasEdge: true,
          layerType: edge.layerType,
        };
        nodes.push(obj);
      }
    }
    if (nodes) {
      for (const node of nodes) {
        const item = this.graph.find(node.id) || node;
        // 线条单独处理
        if (node.shape === 'custom_PolyLine' || node.shape === 'custom_ArrowWithPolyLine'|| node.shape === 'customLine') {
          node.geometrys = [];
          for (const point of item.getModel().points) {
            const x = point[0];
            const y = point[1];
            node.geometrys.push(mapConstants.view.toMap({ x: x - 1, y: y - 1 }));
          }
          // 存进图层
          node.box = item.getBBox();
        } else {
          node.box = node.getBBox ? node.getBBox() : item.getBBox();
          const { minX, minY } = node.box;
          node.geometry = mapConstants.view.toMap({ x: minX, y: minY });
        }
        // 替换或新增
        const index = newData.data.findIndex(value => value.id === node.id);
        if (index === -1) {
          newData.data.push(node);
        } else {
          newData.data.splice(index, 1, node);
        }
      }
      // mapMarking({ type: 'edit', nodes: newData.data });
    }
    // 删除
    for (const id of delNodes) {
      const index = newData.data.findIndex(value => value.id === id);
      if (index !== -1) {
        newData.data.splice(index, 1);
        setTimeout(() => {
          delNodes.splice(delNodes.findIndex(value => value === id), 1);
          this.setState({
            currentSelectNode: {},
          });
        }, 10);
      }
    }
    console.log('newData', newData);
    dispatch({
      type: 'mapRelation/saveMarkData',
      payload: newData,
    });
  };
  handleChange = (e) => {
    const { markData } = this.props;
    const nodes = markData.data.filter(value => value.layerType === e.target.value);
    this.graph.read({ nodes });
    this.graph.layerValue = e.target.value;
    this.setState({
      layerValue: e.target.value,
    });
  };
  // 清空图层
  handleClearLayer = () => {
    this.graph.read({ nodes: [] });
    this.handleSave();
  };
  // 文字标注的值
  handleTextValue = (e) => {
    const { value } = e.target;
    this.setState({
      currentTextValue: value,
    });
  };
  handleOk = () => {
    this.graph.update(this.state.currentTextId, {
      text: this.state.currentTextValue,
    });
    this.setState({
      modalVisible: false,
      currentTextValue: '',
    });
  };
  handleCancel = () => {
    this.setState({
      modalVisible: false,
      currentTextValue: '',
      currentTextId: '',
    });
  };
  handleLayerChange = (e) => {
    const { value } = e.target;
    const { dispatch, markData } = this.props;
    const { type } = markData;
    const index = type.findIndex(item => item === value);
    if (index === -1) {
      type.push(value);
    } else {
      type.splice(index, 1);
    }
    dispatch({
      type: 'mapRelation/saveMarkData',
      payload: markData,
    });
  };
  // 颜色调整
  startChangeColor = (color, type, e) => {
    this.setState({
      currentColor: { color, type },
      showColor: true,
    });
    e.stopPropagation();
  };
  handleColorChange = ({ hex }) => {
    const { currentSelectNode, currentColor } = this.state;
    this.graph.update(currentSelectNode, {
      [currentColor.type]: hex,
    });
  };
  handleChangeComplete =() => {

  };
  render() {
    const {
      zIndex,
      layerValue,
      createNode,
      modalVisible,
      currentTextValue,
      showLayers,
      currentColor,
      showColor,
      currentSelectNode,
    } = this.state;
    const { markType, markData, mapHeight } = this.props;
    return (
      <div className={styles.warp} style={{ zIndex }}>
        <div className={styles.tools} onClick={this.handleClick}>
          <div title="copy">复制</div>
          <div title="paste">粘贴</div>
          <div title="default">默认模式</div>
          <div title="edit">编辑模式</div>
          <div title="layers">图层控制</div>
          <Button htmlType="button" title="empty" type="danger">清空图层</Button>
          <Button htmlType="button" title="del" type="danger">删除</Button>
          <Button htmlType="button" title="save" type="primary">保存</Button>
          <Button htmlType="button" title="back" >返回</Button>
        </div>
        <div
          className={styles.layers}
          style={{ zIndex: showLayers ? 2 : -1, opacity: showLayers ? 1 : 0 }}
          onChange={this.handleLayerChange}
        >
          {markType.map(item => (
            <div key={item.type}>
              <Checkbox checked={markData.type.indexOf(item.type) !== -1} value={item.type}>
                {item.name}
              </Checkbox>
            </div>
))}
        </div>
        <div className={styles.left}>
          <Scrollbars style={{ height: mapHeight - 48 }}>
            <Collapse defaultActiveKey={['1', '2', '3']}>
              <Panel style={getCustomPanelStyle(0)} header={<PanelHead title="图层列表" isHeader />} key="1">
                <Radio.Group onChange={this.handleChange} value={layerValue}>
                  {markType.map(item =>
                    <Radio key={item.type} value={item.type}>{item.name}</Radio>)
                  }
                </Radio.Group>
              </Panel>
              <Panel style={getCustomPanelStyle(1)} header={<PanelHead title="形状选择" />} key="2">
                <div className={styles.dragBox} onClick={this.handleNodeAdd}>
                  {dragNodes.map(item => (
                    <div className={styles.drag} style={{ background: createNode.type === item.id ? '#eee' : '' }} title={item.id} key={item.id}>
                      <div draggable title={item.id} className={styles.node}>
                        <img src={item.src} alt={item.name} title={item.id} />
                      </div>
                      <div className={styles.mark} title={item.id}>{item.name}</div>
                    </div>
))}
                </div>
              </Panel>
              <Panel style={getCustomPanelStyle(1)} header={<PanelHead title="图片标注" />} key="3">
                <div className={styles.dragBox} onClick={this.handleNodeAdd}>
                  {dragImg.map(item => (
                    <div className={styles.drag} style={{ background: createNode.type === item.id ? '#eee' : '' }} title={item.id} key={item.id}>
                      <div draggable title={item.id} className={styles.pic}>
                        <img src={item.src} alt={item.name} title={item.id} />
                      </div>
                      <div className={styles.mark} title={item.id}>{item.name}</div>
                    </div>
                ))}
                </div>
              </Panel>
            </Collapse>
          </Scrollbars>
        </div>
        <Modal
          align="文字标注"
          title="文字标注"
          visible={modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input placeholder="请输入标注文字" onChange={this.handleTextValue} value={currentTextValue} />
        </Modal>
        {currentSelectNode && currentSelectNode.model ? (
          <div className={styles.right}>
            {currentSelectNode.model.stroke ? <div>
              <span>边框色: {currentSelectNode.model.stroke}</span>
              <Button htmlType="button" size="small" type="primary" color={currentSelectNode.model.stroke} onClick={(e) => this.startChangeColor(currentSelectNode.model.stroke, 'stroke', e)}>修改</Button>
            </div> : null }
            {currentSelectNode.model.fill ? <div>
              <span>填充色: {currentSelectNode.model.fill}</span>
              <Button htmlType="button" size="small" type="primary" color={currentSelectNode.model.fill} onClick={(e) => this.startChangeColor(currentSelectNode.model.fill, 'fill', e)}>修改</Button>
            </div> : null }
            {currentSelectNode.model.textFill ? <div>
              <span>文字色: {currentSelectNode.model.textFill}</span>
              <Button htmlType="button" size="small" type="primary" color={currentSelectNode.model.textFill} onClick={(e) => this.startChangeColor(currentSelectNode.model.textFill, 'textFill', e)}>修改</Button>
            </div> : null }
            {currentSelectNode.model.fill1 ? <div>
              <span>旗帜: {currentSelectNode.model.fill1}</span>
              <Button htmlType="button" size="small" type="primary" color={currentSelectNode.model.fill1} onClick={(e) => this.startChangeColor(currentSelectNode.model.fill1, 'fill1', e)}>修改</Button>
            </div> : null }
            {currentSelectNode.model.fill4 ? <div>
              <span>旗杆: {currentSelectNode.model.fill4}</span>
              <Button htmlType="button" size="small" type="primary" color={currentSelectNode.model.fill4} onClick={(e) => this.startChangeColor(currentSelectNode.model.fill4, 'fill4', e)}>修改</Button>
            </div> : null }
            {currentSelectNode.model.fill2 ? <div>
              <span>底座: {currentSelectNode.model.fill2}</span>
              <Button htmlType="button" size="small" type="primary" color={currentSelectNode.model.fill2} onClick={(e) => this.startChangeColor(currentSelectNode.model.fill2, 'fill2', e)}>修改</Button>
            </div> : null }
            {currentSelectNode.model.fill3 ? <div>
              <span>影子: {currentSelectNode.model.fill3}</span>
              <Button htmlType="button" size="small" type="primary" color={currentSelectNode.model.fill3} onClick={(e) => this.startChangeColor(currentSelectNode.model.fill3, 'fill3', e)}>修改</Button>
            </div> : null }
          </div>
) : null
        }

        { showColor ? (
          <div className={styles.color}>
            <SketchPicker
              color={currentColor.color || 'blue'}
              onChange={this.handleColorChange}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>
) : null }
        <div
          onClick={() => this.setState({ showColor: false })}
          className={styles.canvas}
          ref={(ref) => { this.canvas = ref; }}
          onDragEnter={event => event.preventDefault()}
          onDragOver={event => event.preventDefault()}
          onDrop={this.handleDrop}
        />
      </div>
    );
  }
}
