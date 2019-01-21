import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Spin } from 'antd';
import styles from './index.less';
import { registerNode } from '../../FlowEditor/lib/customResgister';

registerNode(); // 注册节点
const { G6_1 } = window;
const editor = { net: {} };

let timer; // 定时器id
let currentResourceID;
@connect(({ flow, homepage, sysFunction, loading }) => {
  return {
    currentFlow: flow.currentFlow,
    GraphiceDatas: flow.GraphiceDatas,
    mapHeight: homepage.mapHeight,
    ztreeObj: sysFunction.ztreeObj,
    loading: loading.effects['flow/getGraphiceDatas'],
  };
})
export default class StatusGraphic extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
      const a = setInterval(() => {
        if (this.flow !== null) {
          clearInterval(a);
          editor.net = new G6_1.Net({
            container: this.flow,
            mode: 'drag',
            forceFit: true,
            fitView: 'autoZoom',
            // width: 1200,
            height: this.props.mapHeight - 54,
            grid: null,
          });
          const { currentFlow } = this.props;
          const data = JSON.parse(currentFlow.data.graphicsContent);

          const newNodes = [];
          const newEdges = [];
          for (const edge of data.source.edges) {
            // 临时对深色箭头的样式处理
            if (edge.color) {
              if (edge.color === '#7f0003') {
                edge.color = '#f9000e';
                edge.size = 1.5;
              }
            }
            let isAdd = true;
            if (edge.controlPoints) {
              for (const item of edge.controlPoints) {
                if (parseFloat(item.x) > 5000 || parseFloat(item.y) > 5000) {
                  isAdd = false;
                }
              }
            }

            if (isAdd) {
              newEdges.push(edge);
            }
          }
          for (const node of data.source.nodes) {
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
            if (Math.abs(parseFloat(node.x)) < 5000 && Math.abs(parseFloat(node.y)) < 5000) {
              if (node.quotaValue) {
                node.quotaValue = '/';
              }
              newNodes.push(node);
            } else if (newEdges.find(value => value.source === node.id) || newEdges.find(value => value.target === node.id)) {
              newNodes.push(node);
            }
          }
          data.source.nodes = newNodes;
          data.source.edges = newEdges;
          editor.net.source(data.source);
          editor.net.render();
          // editor.net.autoZoom();
          currentResourceID = this.props.currentFlow.data.resourceID;
          this.props.dispatch({
            type: 'flow/getGraphiceDatas',
            payload: { resourceID: this.props.currentFlow.data.resourceID },
          }).then(
              () => {
                for (const node of data.source.nodes) {
                  const item = this.props.GraphiceDatas[node.device];
                  if (item) {
                    node.quotaValue = item.value !== '' ? item.value : '/';
                  }
                }
                if (editor.net.destroyed) {
                  return false;
                }
                if (currentResourceID === this.props.currentFlow.data.resourceID) {
                  editor.net.changeData(data.source);
                  // editor.net.refresh();
                }
              });
          timer = setInterval(() => {
            currentResourceID = this.props.currentFlow.data.resourceID;
            const animates = [];
            // 增加数据刷新动效
            // for (const node of data.source.nodes) {
            //   // 需要刷新的节点
            //   const item = this.props.GraphiceDatas[node.device];
            //   if (item) {
            //     item.value = '';
            //     const animateNode = { x: node.x, y: node.y, id: Math.random(), shape: 'loading', size: [80, 80] };
            //     animates.push(animateNode);
            //   }
            // }
            data.source.nodes.push(...animates);
            editor.net.changeData(data.source);
            this.props.dispatch({
              type: 'flow/getGraphiceDatas',
              payload: { resourceID: this.props.currentFlow.data.resourceID },
            }).then(() => {
              const newNodes = data.source.nodes.filter(value => value.shape !== 'loading');
              data.source.nodes = newNodes;
              for (const node of data.source.nodes) {
                const item = this.props.GraphiceDatas[node.device];
                if (item) {
                  node.quotaValue = item.value !== '' ? item.value : '/';
                }
              }
              if (editor.net.destroyed) {
                return false;
              }
              if (currentResourceID === this.props.currentFlow.data.resourceID) {
                editor.net.changeData(data.source);
                // editor.net.refresh();
              }
            });
          }, 10000);
        }
      }, 200);
    }, 500);
  }
  componentWillUnmount() {
    clearInterval(timer);
    editor.net.destroy();
  }
  handleClose() {
    const { ztreeObj, currentFlow } = this.props;
    const node = ztreeObj.getNodeByTId(currentFlow.treeNode.tId);
    ztreeObj.selectNode(node);
  }
  render() {
    const { currentFlow, loading } = this.props;
    return (
      <div className={styles.warp} style={{ height: this.props.mapHeight }}>
        <div style={{ position: 'relative' }}>
          <div className={styles.title}>{currentFlow.data.graphicsName}</div>
          <div className={styles.close} onClick={this.handleClose}>
            <Icon type="close" style={{ fontSize: 20, color: '#fff', fontWeight: 800 }} />
          </div>
          <Spin spinning={loading} wrapperClassName={styles.canvas}>
            <div className={styles.canvas} ref={(ref) => { this.flow = ref; }} />
          </Spin>
        </div>

      </div>

    );
  }
}
