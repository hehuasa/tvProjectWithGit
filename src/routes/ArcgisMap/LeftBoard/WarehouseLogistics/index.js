import React, { PureComponent } from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'dva';
import { Icon, Row, Col, Radio, Button, Collapse, Table, Rate } from 'antd';
import styles from './index.less';
import DashBord from '../DashBord/index';
import { formatDuring } from '../../../../utils/utils';

const Panel = Collapse.Panel;
const mapStateToProps = ({ map }) => {
  const { alarmBoardData } = map;
  return {
    alarmBoardData,
  };
};
@connect(({ map }) => ({
  map,
}))
//  仓储物流
class WarehouseLogistics extends PureComponent {
  state = {
    // 液体罐存 是否是显示列表
    list: true,
    //  公路运输 库位是否是液体罐存
    isLiquid: true,
    //  铁路运输 库位是否是液体罐存
    isRailWay: true,
    //  水路运输 库位是否是液体罐存
    isWaterWay: true,
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
  render() {
    const data = [];
    // 固体仓库表头数据
    const columns = [{
      title: '库位号',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '物料名称',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '批次',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '件数',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '总量',
      dataIndex: 'planType',
      width: 100,
    },
    ];
    // 液体罐存 表头数据
    const liquidCols = [{
      title: '罐存区域',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '罐组名称',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '罐名称',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '液位',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '罐存率',
      dataIndex: 'planType',
      width: 100,
    },
    ];
    // 能源罐存 表头数据
    const energyCols = [{
      title: '仓库名称',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '当前库存',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '库存率',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '最低库存',
      dataIndex: 'planType',
      width: 100,
    },
    ];
    // 公路运输 表头数据
    // 库位非液体罐存
    const highWayCols = [{
      title: '已进厂',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '已出厂',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '准备进厂',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '领取防火罩',
      dataIndex: 'planType',
      width: 100,
    },
    ];
    // 库位液体罐存
    const isLiquidCols = [{
      title: '罐组',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '装车名称',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '泵出口压力',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '孔板流量计',
      dataIndex: 'planType',
      width: 100,
    },
    ];
    // 铁路运输
    const railWayCols = [{
      title: '发货单号',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '计划量',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '已发量(合计)',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '已发车厢数量',
      dataIndex: 'planType',
      width: 100,
    },
    ];
    // 水路运输
    const waterWayCols = [{
      title: '发货时间',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '产品名称',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '实发量',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '车船号',
      dataIndex: 'planType',
      width: 100,
    }, {
      title: '物资进厂类型',
      dataIndex: 'planType',
      width: 100,
    },
    ];
    // 管道运输
    const pipelineCols = [{
      title: '物料名称',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '进出类别',
      dataIndex: 'planName',
      width: 100,
    }, {
      title: '流量',
      dataIndex: 'planType',
      width: 100,
    },
    ];
    return (
      <div className={styles.warp}>
        <div className={styles.header}>
          <div className={styles.name}>仓储物流</div>
          <div className={styles.close}>
            <Button type="primary" size="small" onClick={this.handleClick}> X </Button>
          </div>
        </div>
        <Scrollbars style={{ height: 280 }}>
          <Collapse bordered={false} defaultActiveKey={['0']}>
            <Panel header={<div className={styles.panelHeader}>固体仓库</div>} key="0" className={styles.type}>
              <Table
                size="small"
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 500, y: 180 }}
              />
            </Panel>
            <Panel header={<div className={styles.panelHeader}>液体罐存</div>} key="1" className={styles.type}>
              { this.state.list ? (
                <Table
                  size="small"
                  columns={liquidCols}
                  dataSource={data}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 500, y: 180 }}
                />
              ) : (
                <Row gutter={{ xs: 8, sm: 16, md: 24 }} type="flex">
                  <Col span={8}>罐存区域：</Col><Col span={16} />
                  <Col span={8}>罐组名称：</Col><Col span={16} />
                  <Col span={8}>罐名称：</Col><Col span={16} />
                  <Col span={8}>液位：</Col><Col span={16} />
                  <Col span={8}>罐存率：</Col><Col span={16} />
                </Row>
              )
              }
            </Panel>
            <Panel header={<div className={styles.panelHeader}>能源仓库</div>} key="2" className={styles.type}>
              <Table
                size="small"
                columns={energyCols}
                dataSource={data}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 400, y: 180 }}
              />
            </Panel>
            <Panel header={<div className={styles.panelHeader}>公路运输</div>} key="3" className={styles.type}>
              <Table
                size="small"
                columns={highWayCols}
                dataSource={data}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 400, y: 180 }}
              />
            </Panel>
            { this.state.isLiquid ? (
              <Panel header={<div className={styles.panelHeader}>液体产品装车信息</div>} key="4" className={styles.type}>
                <Table
                  size="small"
                  columns={isLiquidCols}
                  dataSource={data}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 400, y: 180 }}
                />
              </Panel>
            ) : null
            }
            <Panel header={<div className={styles.panelHeader}>铁路运输</div>} key="5" className={styles.type}>
              <Table
                size="small"
                columns={railWayCols}
                dataSource={data}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 400, y: 180 }}
              />
            </Panel>
            { this.state.isRailWay ? (
              <Panel header={<div className={styles.panelHeader}>液体产品装车信息</div>} key="6" className={styles.type}>
                <Table
                  size="small"
                  columns={isLiquidCols}
                  dataSource={data}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 400, y: 180 }}
                />
              </Panel>
            ) : null
            }
            <Panel header={<div className={styles.panelHeader}>水路运输</div>} key="7" className={styles.type}>
              <Table
                size="small"
                columns={waterWayCols}
                dataSource={data}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 500, y: 180 }}
              />
            </Panel>
            { this.state.isWaterWay ? (
              <Panel header={<div className={styles.panelHeader}>液体产品装车信息</div>} key="8" className={styles.type}>
                <Table
                  size="small"
                  columns={isLiquidCols}
                  dataSource={data}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 400, y: 180 }}
                />
              </Panel>
            ) : null
            }
            <Panel header={<div className={styles.panelHeader}>管道运输</div>} key="9" className={styles.type}>
              <Table
                size="small"
                columns={pipelineCols}
                dataSource={data}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 300, y: 180 }}
              />
            </Panel>
          </Collapse>
        </Scrollbars>
        <div className={styles.btn}>
          <Button size="small" onClick={this.openBoard}>液体罐存看板</Button>
          <Button size="small" onClick={this.openBoard}>公路运输看板</Button>
          <Button size="small" onClick={this.openBoard}>铁路运输看板</Button>
        </div>
      </div>);
  }
}
export default connect(mapStateToProps)(WarehouseLogistics);
