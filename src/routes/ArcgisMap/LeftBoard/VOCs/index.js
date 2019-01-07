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
@connect(({ resourceTree, vocs, panelBoard }) => ({
  resourceTree,
  vocs,
  panelBoard,
}))
//  VOCs治理
class VOCs extends PureComponent {
  state = {
    list: true,
  };
  componentDidMount() {
  //  请求区域的 检测列表
    const { dispatch, vocs } = this.props;
    const { areaCode } = vocs;
    dispatch({
      type: 'vocs/getAllPlanByArea',
      payload: { areaCode },
    });
  }
  // 关闭面板
  handleClick = () => {
    this.props.dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
  };
  /**
   * @author HuangJie
   * @date 2018/5/21
   * @Description: 打开vocs治理看板
  */
  openBoard = () => {

    const { expandKeys, activeKeys } = this.props.panelBoard;
    const openBoardpanel = (boardType) => {
      const newArr = [];
      for (const arr of activeKeys) {
        newArr.push(arr.keys);
      }
      if (newArr.indexOf(boardType) === -1) {
        expandKeys.push(boardType);
        this.props.dispatch({
          type: 'panelBoard/queryList',
          payload: {
            expandKeys,
            activeKeys: [
              { name: boardType, uniqueKey: 0, keys: boardType, param: { title: 'VOCs治理看板' } },
              ...activeKeys,
            ],
          },
        });
      } else if (expandKeys.indexOf(boardType) === -1) {
        expandKeys.push(boardType);
        this.props.dispatch({
          type: 'panelBoard/queryList',
          payload: {
            expandKeys,
            activeKeys,
          },
        });
      } 
    };
    openBoardpanel('VOCSGovernList');

  };
  /**
   * @author huangjie
   * @date 2018/5/21
   * @Description: 打开面板函数
   */
  // toggleBoardList = (expandKeys, activeKeys, boardType) => {
  //   const expandArr = JSON.parse(JSON.stringify(expandKeys));
  //   const position = expandArr.indexOf(boardType);
  //   if (position === -1) {
  //     expandArr.splice(0, 0, boardType);
  //   } else {
  //     expandArr.splice(position, 1);
  //   }
  //   this.props.dispatch({
  //     type: 'panelBoard/queryList',
  //     payload: { expandKeys: expandArr, activeKeys },
  //   });
  // };
  getDetail = (planId) => {
    this.setState({
      list: false,
    });
    // 向下钻去计划详情
    this.props.dispatch({
      type: 'vocs/getAllPlanByID',
      payload: { planId },
    });
  };
  turnBack = (e) => {
    e.stopPropagation();
    this.setState({
      list: true,
    });
  };
  render() {
    const { inspectionPlan } = this.props.vocs;
    const { planInfo } = this.props.vocs;
    // 表头数据
    const columns = [{
      title: '检测计划名称',
      dataIndex: 'planName',
      width: 120,
      render: (text, record) => {
        return <a href="javascript:;" title="点击查看作业详情" onClick={() => this.getDetail(record.vOCsCheckPlanID)}>{text}</a>;
      },
    }, {
      title: '计划类型',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '检测开始日期',
      dataIndex: 'begin',
      width: 160,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    }, {
      title: '检测截止日期',
      dataIndex: 'end',
      width: 160,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    },
    ];
    // 检测计划详情表头
    const planCols = [{
      title: '装置区域',
      dataIndex: 'area',
      width: 120,
      render: (text, record) => {
        return record.voCsCheckPlan.resResourceInfo.area.areaName;
      },
    }, {
      title: '检测计划名称',
      dataIndex: 'planName',
      width: 120,
      render: (text, record) => {
        return record.voCsCheckPlan.planName;
      },
    }, {
      title: '计划类型',
      dataIndex: 'planType',
      width: 100,
      render: (text, record) => {
        return record.voCsCheckPlan.planType;
      },
    }, {
      title: '检测开始日期',
      dataIndex: 'begin',
      width: 160,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    }, {
      title: '检测截止日期',
      dataIndex: 'end',
      width: 160,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    }, {
      title: '已检测点数',
      dataIndex: 'finishPoint',
      width: 100,
    }, {
      title: '剩余天数',
      dataIndex: 'finishDays',
      width: 100,
    }, {
      title: '泄漏数量',
      dataIndex: 'num',
      width: 100,
    }, {
      title: '泄漏率',
      dataIndex: 'rate',
      width: 100,
    },
    ];

    const listTitle = <div className={styles.panelHeader}>计划列表</div>;
    const infoTitle = <div className={styles.panelHeader}>计划详情 <div onClick={this.turnBack} title="返回计划列表" className={styles.back}><Icon type="rollback" /></div></div>;
    return (
      <div className={styles.warp}>
        <div className={styles.header}>
          <div className={styles.name}>VOCs治理</div>
          <div className={styles.close}>
            <Button type="primary" size="small" onClick={this.handleClick}> X </Button>
          </div>
        </div>
        <Scrollbars style={{ height: 280 }}>
          <Collapse bordered={false} defaultActiveKey={['0']}>
            <Panel header={this.state.list ? listTitle : infoTitle} key="0">
              { this.state.list ? (
                <Table
                  size="small"
                  columns={columns}
                  dataSource={inspectionPlan}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 540, y: 180 }}
                />
                ) : (
                  <Table
                    size="small"
                    columns={planCols}
                    dataSource={planInfo}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1060, y: 180 }}
                  />
                )
              }
            </Panel>
          </Collapse>
        </Scrollbars>
      </div>);
  }
}
export default connect(mapStateToProps)(VOCs);
