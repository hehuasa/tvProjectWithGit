import React, { PureComponent } from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'dva';
import { Icon, Row, Col, Radio, Button, Collapse, Table, Rate } from 'antd';
import styles from './index.less';

const Panel = Collapse.Panel;
const mapStateToProps = ({ resourceTree, map }) => {
  return {
    resourceTree,
    map,
  };
};
@connect(({ resourceTree }) => ({
  resourceTree,
}))
//  安全风险、危险源模板
class SourceOfRisk extends PureComponent {
  componentDidMount() {
    const { resourceTree, dispatch } = this.props;
    const { ctrlResourceType } = resourceTree;
    const { riskID } = resourceTree;
    if (ctrlResourceType === 'sourceOfRisk') {
      dispatch({
        type: 'resourceTree/getSourceOfRisk',
        payload: { areaCode: riskID },
      });
    } else if (ctrlResourceType === 'securityRisk') {
      dispatch({
        type: 'resourceTree/getSecurityRisk',
        payload: { areaCode: riskID },
      });
    }
  }
  // 关闭面板
  handleClick = () => {
    this.props.dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
    this.props.dispatch({
      type: 'resourceTree/saveRiskID',
      payload: '',
    });
  };
  render() {
    const { sourceOfRisk, securityRisk, ctrlResourceType } = this.props.resourceTree;
    let infoTile = '';
    if (ctrlResourceType === 'sourceOfRisk') {
      infoTile = '危险源';
    } else if (ctrlResourceType === 'securityRisk') {
      infoTile = '安全风险';
    }
    // 危险源表头数据
    const hazarkCols = [{
      title: '危险源名称',
      dataIndex: 'hazardName',
      width: 120,
      key: 1,
    }, {
      title: '危险性描述',
      dataIndex: 'hazardDes',
      key: 2,
      width: 160,
    }, {
      title: '危险物质',
      dataIndex: 'rawMaterialName',
      key: 3,
      width: 120,
      render: (text, record) => {
        return record.resRawMaterialInfo.rawMaterialName;
      },
    }, {
      title: '临界量',
      dataIndex: 'criticalValue',
      key: 4,
      width: 100,
    }, {
      title: '实际储量',
      dataIndex: 'stock',
      key: 5,
      width: 100,
    }, {
      title: '所在装置',
      dataIndex: 'areaName',
      key: 6,
      width: 100,
      render: (text, record) => {
        return record.area.areaName;
      },
    }, {
      title: '安全责任人',
      dataIndex: 'userName',
      key: 7,
      width: 100,
      render: (text, record) => {
        return record.user.userName;
      },
    }, {
      title: '联系电话',
      dataIndex: 'mobile',
      key: 8,
      width: 100,
      render: (text, record) => {
        return record.user.mobile;
      },
    }
    ];
    // 安全风险表头数据
    const riskCols = [{
      title: '风险名称',
      dataIndex: 'riskName',
      width: 120,
    }, {
      title: '风险类别',
      dataIndex: 'riskType',
      width: 100,
    }, {
      title: '基本情况',
      dataIndex: 'riskDes',
      width: 160,
    }, {
      title: '风险简要特征',
      dataIndex: 'riskFeature',
      width: 160,
    }, {
      title: '风险管控措施',
      dataIndex: 'riskControl',
      width: 160,
    }, {
      title: '所在装置',
      dataIndex: 'areaName',
      width: 100,
      render: (text, record) => {
        return record.area.areaName;
      },
    }, {
      title: '安全责任人',
      dataIndex: 'userName',
      width: 100,
      render: (text, record) => {
        return record.user.userName;
      },
    }, {
      title: '联系电话',
      dataIndex: 'mobile',
      width: 100,
      render: (text, record) => {
        return record.user.mobile;
      },
    }];
    return (
      <div className={styles.warp}>
        <div className={styles.header}>
          <div className={styles.name}>{infoTile}</div>
          <div className={styles.close}>
            <Button type="primary" size="small" onClick={this.handleClick}> X </Button>
          </div>
        </div>
        <Scrollbars style={{ height: 280 }}>
          <div>
            <Collapse bordered={false} defaultActiveKey={['0']}>
              { ctrlResourceType === 'sourceOfRisk' ? (
                <Panel header={<div className={styles.panelHeader}>基本信息</div>} key="0" className={styles.type}>
                  <Table
                    size="small"
                    columns={hazarkCols}
                    dataSource={sourceOfRisk}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1000, y: 180 }}
                  />
                </Panel>
              ) : null
            }
              { ctrlResourceType === 'securityRisk' ? (
                <Panel header={<div className={styles.panelHeader}>基本信息</div>} key="1" >
                  <Table
                    size="small"
                    columns={riskCols}
                    dataSource={securityRisk}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1000, y: 180 }}
                  />
                </Panel>) : null
            }
            </Collapse>
          </div>
        </Scrollbars>
      </div>);
  }
}
export default connect(mapStateToProps)(SourceOfRisk);
