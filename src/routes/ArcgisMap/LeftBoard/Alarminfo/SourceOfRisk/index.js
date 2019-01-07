import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Collapse, Row, Col } from 'antd';
import styles from '../index.less';
import PlanInfo from '../../../../PlanManagement/PlanInfo/index';

const { Panel } = Collapse;

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
  state = {
    visible: false,
    planInfoID: null,
  };
  componentDidMount() {
    const { resourceTree, dispatch } = this.props;
    const { ctrlResourceType } = resourceTree;
    const { riskID } = resourceTree;
    const { area } = resourceTree.resourceInfo;
    if (area && ctrlResourceType.indexOf('101.201.101') === 0) {
      dispatch({
        type: 'resourceTree/getSourceOfRisk',
        payload: { areaCode: riskID || area.areaCode },
      });
    } else if (area && ctrlResourceType.indexOf('101.201.102') === 0) {
      dispatch({
        type: 'resourceTree/getSecurityRisk',
        payload: { areaCode: riskID || area.areaCode },
      });
    }
  }
  onCancel = () => {
    this.setState({
      visible: false,
    });
  };
  onOk = () => {
    this.setState({
      visible: false,
    });
  };
  onOpenModel = (planInfoID) => {
    // 请求预案信息
    this.props.dispatch({
      type: 'planManagement/getPlanInfo',
      payload: {
        id: planInfoID,
      },
    }).then(() => {
      this.setState({
        visible: true,
        planInfoID,
      });
    });
  };
  render() {
    const { sourceOfRisk, securityRisk, ctrlResourceType } = this.props.resourceTree;
    sourceOfRisk.map((item, index) => {
      item.key = index;
      return item;
    });
    securityRisk.map((item, index) => {
      item.key = index;
      return item;
    });
    const expandKeys = [];
    for (const item of sourceOfRisk) {
      expandKeys.push(item.hazardName);
    }
    // 危险源表头数据
    const hazarkCols = [
      {
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
      }];
    // 安全风险表头数据
    const riskCols = [
      {
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
      <div>
        { ctrlResourceType.indexOf('101.201.101') === 0 ? (
          <Collapse bordered={false} defaultActiveKey={expandKeys}>
            { sourceOfRisk.map((item) => {
            return (
              <Panel key={item.hazardName} header={<div className={styles.panelHeader}>{item.hazardName}</div>}>
                <Row type="flex">
                  <Col span={10}>危险源名称：</Col><Col span={14}>{item.hazardName}</Col>
                  <Col span={10}>危险性描述：</Col><Col span={14}>{item.hazardDes}</Col>
                  <Col span={10}>危险物质：</Col><Col span={14}>{item.resRawMaterialInfo.rawMaterialName}</Col>
                  <Col span={10}>临界量：</Col><Col span={14}>{item.criticalValue}</Col>
                  <Col span={10}>实际储量：</Col><Col span={14}>{item.stock}</Col>
                  <Col span={10}>所在装置：</Col><Col span={14}>{item.area.areaName}</Col>
                  <Col span={10}>安全责任人：</Col><Col span={14}>{item.user.userName}</Col>
                  <Col span={10}>联系电话：</Col><Col span={14}>{item.user.mobile}</Col>
                  {/* <Col span={10}>关联预案：</Col><Col span={14}><a href="#" onClick={() => this.onOpenModel(item.planInfoID)}>{item.planInfoName}</a></Col> */}
                  <Col span={10}>关联预案：</Col><Col span={14}><a href="#" onClick={() => this.onOpenModel(1)}>防洪预案</a></Col>
                </Row>
              </Panel>
            );
          })}
          </Collapse>
          ) : null
            }
        { ctrlResourceType.indexOf('101.201.102') === 0 ? (
          <Collapse bordered={false} defaultActiveKey={expandKeys}>
            { securityRisk.map((item) => {
              return (
                <Panel key={item.riskName} header={<div className={styles.panelHeader}>{item.riskName}</div>}>
                  <Row type="flex">
                    <Col span={10}>风险名称：</Col><Col span={14}>{item.riskCols}</Col>
                    <Col span={10}>风险类别：</Col><Col span={14}>{item.riskType}</Col>
                    <Col span={10}>基本情况：</Col><Col span={14}>{item.riskDes}</Col>
                    <Col span={10}>风险简要特征：</Col><Col span={14}>{item.riskFeature}</Col>
                    <Col span={10}>风险管控措施：</Col><Col span={14}>{item.stock}</Col>
                    <Col span={10}>所在装置：</Col><Col span={14}>{item.area.areaName}</Col>
                    <Col span={10}>安全责任人：</Col><Col span={14}>{item.user.userName}</Col>
                    <Col span={10}>联系电话：</Col><Col span={14}>{item.user.mobile}</Col>
                     <Col span={10}>关联预案：</Col><Col span={14}><a href="#" onClick={() => this.onOpenModel(item.planInfoID)}>{item.planInfoName}</a></Col>
                    {/*<Col span={10}>关联预案：</Col><Col span={14}><a href="#" onClick={() => this.onOpenModel(1)}>防洪预案</a></Col>*/}
                  </Row>
                </Panel>
              );
            })}
          </Collapse>
        ) : null
            }
        <Modal
          destroyOnClose
          title="预案信息"
          visible={this.state.visible}
          onOk={this.onOk}
          width="80%"
          onCancel={this.onCancel}
          zIndex="1002"
        >
          <PlanInfo planInfoID={this.state.planInfoID} hideFooter />
        </Modal>
      </div>);
  }
}
export default connect(mapStateToProps)(SourceOfRisk);
