import React, { PureComponent } from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'dva';
import { Icon, Row, Col, Radio, Button, Collapse, Table, Rate, Popover } from 'antd';
import styles from './index.less';
import DashBord from '../DashBord/index';
import { formatDuring } from '../../../../utils/utils';

const Panel = Collapse.Panel;
const mapStateToProps = ({ map, resourceTree }) => {
  const { alarmBoardData } = map;
  return {
    alarmBoardData,
    resourceTree,
  };
};
@connect(({ map, resourceTree, alarm }) => ({
  map,
  resourceTree,
  list: alarm.list,
}))
//  作业监控
class WorkMonitor extends PureComponent {
  state = {
    list: true,
  }
  componentDidMount() {
  }
  // 关闭面板
  handleClick = () => {
    this.props.dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
  };
  getDetail = (text) => {
    this.setState({
      list: false,
    });
  }
  turnBack = (e) => {
    e.stopPropagation();
    this.setState({
      list: true,
    });
  
  }
  render() {
    // 表头数据
    const columns = [{
      title: '流水号',
      dataIndex: 'num',
      width: 80,
      render: (text) => {
        return <a href="javascript:;" title="点击查看作业详情" onClick={() => this.getDetail(text)}>{text}</a>;
      },
    }, {
      title: '作业区域',
      dataIndex: 'org',
      width: 100,
    }, {
      title: '作业类型',
      dataIndex: 'type',
      width: 100,
    }, {
      title: '申请单位',
      dataIndex: 'unit',
      width: 100,
    }, {
      title: '作业地点描述',
      dataIndex: 'desc',
      width: 120,
    },
    ];
    // 表格数据
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i,
        num: `a-${i}`,
        org: '中间罐区',
        type: `动火作业. ${i}`,
        unit: '安全部',
        desc: '相关描述',
      });
    }
    const infoCols = [{
      title: '流水号',
      dataIndex: 'num',
      width: 80,
    }, {
      title: '申请人',
      dataIndex: 'org',
      width: 100,
      render: (text) => {
        return (
          <Popover placement="topLeft" title="关联信息" content="电话：18965874258" trigger="click">
            <a href="javascript:;" title="点击查看关联信息">{text}</a>
          </Popover>
        );
      },
    }, {
      title: '申请单位',
      dataIndex: 'type',
      width: 100,
    }, {
      title: '装置界区域',
      dataIndex: 'unit',
      width: 100,
    }, {
      title: '作业开始时间',
      dataIndex: 'desc',
      width: 120,
    }, {
      title: '作业结束时间',
      dataIndex: 'desc',
      width: 120,
    }, {
      title: '作业类别',
      dataIndex: 'desc',
      width: 120,
    }, {
      title: '作业等级',
      dataIndex: 'desc',
      width: 120,
    }, {
      title: '作业地点描述',
      dataIndex: 'desc',
      width: 120,
    }, {
      title: '相关设备',
      dataIndex: 'desc',
      width: 120,
    }, {
      title: '设备介质',
      dataIndex: 'desc',
      width: 120,
    }, {
      title: '项目负责人',
      dataIndex: 'desc',
      width: 120,
    }, {
      title: '施工单位',
      dataIndex: 'desc',
      width: 120,
    }, {
      title: '作业内容',
      dataIndex: 'desc',
      width: 120,
    }, {
      title: '作业人员',
      dataIndex: 'desc',
      width: 120,
    }, {
      title: '监护人',
      dataIndex: 'desc',
      width: 120,
    }, {
      title: '安全措施',
      dataIndex: 'desc',
      width: 120,
    },
    ];
    const infoData = [];
    for (let i = 0; i < 100; i++) {
      infoData.push({
        key: i,
        num: `a-${i}`,
        org: '中间罐区',
        type: `动火作业. ${i}`,
        unit: '安全部',
        desc: '相关描述',
      });
    }
    const listTitle = <div className={styles.panelHeader}>作业列表</div>;
    const infoTitle = <div className={styles.panelHeader}>作业详情 <div onClick={this.turnBack} title="返回作业列表" className={styles.back}><Icon type="rollback" /></div></div>;
    return (
      <div className={styles.warp}>
        <div className={styles.header}>
          <div className={styles.name}>作业监控</div>
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
                  dataSource={data}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: true, y: 180 }}
                />
                ) : (
                  <Table
                    size="small"
                    columns={infoCols}
                    dataSource={infoData}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true, y: 180 }}
                  />
                )
              }
            </Panel>
          </Collapse>
        </Scrollbars>
        <div className={styles.btn}>
          <Button size="small">打开看板</Button>
          <Button size="small" onClick={this.handleVideoPlay}>视频联动</Button>
        </div>
      </div>);
  }
}
export default connect(mapStateToProps)(WorkMonitor);
