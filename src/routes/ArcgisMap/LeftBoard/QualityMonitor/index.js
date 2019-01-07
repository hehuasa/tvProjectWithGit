import React, { PureComponent } from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'dva';
import { Icon, Row, Col, Radio, Button, Collapse, Table, Rate, Popover } from 'antd';
import styles from './index.less';

const Panel = Collapse.Panel;
const mapStateToProps = ({ resourceTree }) => {
  return {
    resourceTree,
  };
};
@connect(({ resourceTree, panelBoard, constantlyData }) => ({
  resourceTree,
  panelBoard,
  constantlyData,
}))
//  质量检测
class QualityMonitor extends PureComponent {
  state = {
    list: true,
  };
  componentDidMount() {
  }
  /**
   * @author HuangJie
   * @date 2018/5/22
   * @Description: 关闭资源信息窗
  */
  handleClick = () => {
    this.props.dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
  };
  /**
   * @author HuangJie
   * @date 2018/5/21
   * @Description: 打开看板
  */
  openBoard = () => {
    const { panelBoard } = this.props;
    const { expandKeys, activeKeys } = panelBoard;
    if (activeKeys.indexOf('VOCSGovernList') === -1) {
      const activeArr = JSON.parse(JSON.stringify(activeKeys));
      activeArr.unshift('VOCSGovernList');
      this.toggleBoardList(expandKeys, activeArr, 'VOCSGovernList');
    } else {
      this.toggleBoardList(expandKeys, activeKeys, 'VOCSGovernList');
    }
  };
  /**
   * @author huangjie
   * @date 2018/5/21
   * @Description: 打开面板函数
   */
  toggleBoardList = (expandKeys, activeKeys, boardType) => {
    const expandArr = JSON.parse(JSON.stringify(expandKeys));
    const position = expandArr.indexOf(boardType);
    if (position === -1) {
      expandArr.splice(0, 0, boardType);
    } else {
      expandArr.splice(position, 1);
    }
    this.props.dispatch({
      type: 'panelBoard/queryList',
      payload: { expandKeys: expandArr, activeKeys },
    });
  };
  getDetail = (planId) => {
    this.setState({
      list: false,
    });
    this.props.dispatch({
      type: 'vocs/getAllPlanByID',
      payload: { planId },
    });
  };
  render() {
    const { showLevel } = this.props.constantlyData;
    const data = [];
    // 表头数据
    const columns = [{
      title: '实时位号',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '仪表位号',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '仪器名称',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '物料名称',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '分析项目',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '控制指标',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '测量范围',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '监测值',
      dataIndex: 'planType',
      width: 100,
    },
    ];
    return (
      <div className={styles.warp}>
        <div className={styles.header}>
          <div className={styles.name}>质量检测</div>
          <div className={styles.close}>
            <Button type="primary" size="small" onClick={this.handleClick}> X </Button>
          </div>
        </div>
        <Scrollbars style={{ height: 280 }}>
          <Collapse bordered={false} defaultActiveKey={['0']}>
            <Panel header="点位在线分析" key="0">
              { showLevel === 'plantLevel' ? (
                <Row gutter={{ xs: 8, sm: 16, md: 24 }} type="flex">
                  <Col span={8}>实时位号：</Col><Col span={16}></Col>
                  <Col span={8}>仪表位号：</Col><Col span={16}></Col>
                  <Col span={8}>仪器名称：</Col><Col span={16}></Col>
                  <Col span={8}>物料名称：</Col><Col span={16}></Col>
                  <Col span={8}>分析项目：</Col><Col span={16}></Col>
                  <Col span={8}>控制指标：</Col><Col span={16}></Col>
                  <Col span={8}>测量范围：</Col><Col span={16}></Col>
                  <Col span={8}>监测值：</Col><Col span={16}></Col>
                </Row>
                ) : (
                  <Table
                    size="small"
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true, y: 180 }}
                  />
                )
              }
            </Panel>
          </Collapse>
        </Scrollbars>
      </div>);
  }
}
export default connect(mapStateToProps)(QualityMonitor);
