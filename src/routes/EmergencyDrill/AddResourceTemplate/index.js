import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, TreeSelect, Input, Card, Icon, InputNumber, Button } from 'antd';
import styles from './index.less';
import SelectMaterial from '../SelectMaterial/index';
import { getUUID } from '../../../utils/utils';

const { TreeNode } = TreeSelect;
const FormItem = Form.Item;
const Search = Input.Search;
@connect(({ drillManage, typeCode, organization }) => ({
  drillPage: drillManage.drillPage,
  orgList: drillManage.orgList,
  typeCode,
  organization,
}))
@Form.create()
export default class TempLate extends PureComponent {
  state = {
    resourceType: 1,
    name: '',
    visible: false,
    orgID: null,
    resourceID: null,
    toolMaterialInfoID: null,
  };
  // 添加一个参演部门
  addOrg = () => {
    const { orgList, dispatch } = this.props;
    const orgTemplate = {
      id: getUUID(),
      orgID: null,
      userCount: 0,
      resource: [
        // { id: getUUID(), resourceID: null, useCount: 0 },
      ],
      rawMaterial: [
        // { id: getUUID(), toolMaterialInfoID: null, useCount: 0 },
      ],
    };
    const arr = [...orgList];
    arr.push(orgTemplate);
    dispatch({
      type: 'drillManage/saveOrgList',
      payload: arr,
    });
  };
  // 添加一个参演部门
  deleteOrg = (id) => {
    const { orgList, dispatch } = this.props;
    const arr = orgList.filter(c => c.id !== id);
    dispatch({
      type: 'drillManage/saveOrgList',
      payload: arr,
    });
  };
  // 添加 参演部门所需资源
  addResource = (orgID) => {
    const { orgList, dispatch } = this.props;
    const arr = orgList.map((org) => {
      if (org.id === orgID) {
        org.resource.push({ id: getUUID(), resourceID: null, useCount: 0 });
      }
      return org;
    });
    dispatch({
      type: 'drillManage/saveOrgList',
      payload: arr,
    });
  };
  // 删除 参演部门所需资源
  deleteResource = (orgID, resourceID) => {
    const { orgList, dispatch } = this.props;
    const arr = orgList.map((org) => {
      if (org.id === orgID) {
        org.resource = org.resource.filter(res => res.id !== resourceID);
      }
      return org;
    });
    dispatch({
      type: 'drillManage/saveOrgList',
      payload: arr,
    });
  };
  // 添加 参演部门所需物资
  addRawMaterial= (orgID) => {
    const { orgList, dispatch } = this.props;
    const arr = orgList.map((org) => {
      if (org.id === orgID) {
        org.rawMaterial.push({ id: getUUID(), toolMaterialInfoID: null, useCount: 0 });
      }
      return org;
    });
    dispatch({
      type: 'drillManage/saveOrgList',
      payload: arr,
    });
  };
  // 删除 参演部门所需物资
  deleteRawMaterial = (orgID, toolMaterialInfoID) => {
    const { orgList, dispatch } = this.props;
    const arr = orgList.map((org) => {
      if (org.id === orgID) {
        org.rawMaterial = org.rawMaterial.filter(res => res.id !== toolMaterialInfoID);
      }
      return org;
    });
    dispatch({
      type: 'drillManage/saveOrgList',
      payload: arr,
    });
  };
  // 搜索资源
  searchResource = (value, orgID, resourceID) => {
    this.setState({
      resourceType: 1,
      name: value,
      visible: true,
      orgID,
      resourceID,
    });
    this.props.dispatch({
      type: 'drillManage/geResourcePage',
      payload: { resourceName: value, pageNum: 1, pageSize: 5 },
    });
  };
  // 搜索物资
  searchMaterial = (value, orgID, toolMaterialInfoID) => {
    this.setState({
      resourceType: 2,
      name: value,
      visible: true,
      orgID,
      toolMaterialInfoID,
    });
    this.props.dispatch({
      type: 'drillManage/getMaterialPage',
      payload: { materialName: value, pageNum: 1, pageSize: 5 },
    });
  };
  // 部门 参演人数
  orgNumChange = (value, orgID) => {
    const { orgList, dispatch } = this.props;
    let arr = [];
    arr = orgList.map((org) => {
      if (org.id === orgID) {
        org.userCount = value;
      }
      return org;
    });
    dispatch({
      type: 'drillManage/saveOrgList',
      payload: arr,
    });
  };
  // 物资数量改变
  rawNumChange = (value, orgID, toolMaterialInfoID) => {
    const { orgList, dispatch } = this.props;
    let arr = [];
    arr = orgList.map((org) => {
      if (org.id === orgID) {
        org.rawMaterial = org.rawMaterial.map((res) => {
          if (res.id === toolMaterialInfoID) {
            res.useCount = value;
          }
          return res;
        });
      }
      return org;
    });
    dispatch({
      type: 'drillManage/saveOrgList',
      payload: arr,
    });
  };
  // 资源数量改变
  resNumChange = (value, orgID, resourceID) => {
    const { orgList, dispatch } = this.props;
    let arr = [];
    arr = orgList.map((org) => {
      if (org.id === orgID) {
        org.resource = org.resource.map((res) => {
          if (res.id === resourceID) {
            res.useCount = value;
          }
          return res;
        });
      }
      return org;
    });
    dispatch({
      type: 'drillManage/saveOrgList',
      payload: arr,
    });
  };
  // 关闭弹窗
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  // 选择的数据
  selectRow = (row) => {
    const { orgID, resourceType, resourceID, toolMaterialInfoID } = this.state;
    const { orgList, dispatch } = this.props;
    let arr = [];
    if (resourceType === 1) {
      arr = orgList.map((org) => {
        if (org.id === orgID) {
          org.resource = org.resource.map((res) => {
            if (res.id === resourceID) {
              res.resourceID = row.resourceID;
              res.resourceName = row.resourceName;
            }
            return res;
          });
        }
        return org;
      });
    } else if (resourceType === 2) {
      arr = orgList.map((org) => {
        if (org.id === orgID) {
          org.rawMaterial = org.rawMaterial.map((res) => {
            if (res.id === toolMaterialInfoID) {
              res.toolMaterialInfoID = row.toolMaterialInfoID;
              res.materialName = row.materialName;
            }
            return res;
          });
        }
        return org;
      });
    }
    dispatch({
      type: 'drillManage/saveOrgList',
      payload: arr,
    });
    this.setState({
      visible: false,
    });
  };
  // 部门树变化
  onOrgTreeChange = (value, label, extra, orgID) => {
    const { orgList, dispatch } = this.props;
    let arr = [];
    arr = orgList.map((org) => {
      if (org.id === orgID) {
        org.orgID = extra.triggerNode.props.eventKey;
        org.organizationName = value;
      }
      return org;
    });
    dispatch({
      type: 'drillManage/saveOrgList',
      payload: arr,
    });
  };
  render() {
    const { depList } = this.props;
    const renderDeptTreeNodes = (data) => {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode
              title={item.orgnizationName}
              key={item.orgID}
              value={item.orgnizationName}
            >
              {renderDeptTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.orgnizationName} key={item.orgID} value={item.orgnizationName} />;
      });
    };
    return (
      <Row>
        <Col span={24}>
          <Card
            title="参演部门"
            extra={<Button type="primary" onClick={this.addOrg}>添加参演部门</Button>}
            bordered={false}
          >
            {this.props.orgList.map((org, index) => {
              return (
                <div className={styles.orgColor} key={org.orgID}>
                  <div className={styles.content}>
                    <Row>
                      <Col span={8}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 14 }}
                          label="参演部门"
                        >
                          <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择所属部门"
                            value={org.organizationName || ''}
                            allowClear
                            onChange={(value, label, extra) => this.onOrgTreeChange(value, label, extra, org.id)}
                          >
                            {renderDeptTreeNodes(depList)}
                          </TreeSelect>
                        </FormItem>
                      </Col>
                      <Col span={6}>
                        <FormItem
                          labelCol={{ span: 10 }}
                          wrapperCol={{ span: 14 }}
                          label="参演人数"
                        >
                          <InputNumber min={0} value={org.userCount} onChange={value => this.orgNumChange(value, org.id)} />
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem
                          labelCol={{ span: 24 }}
                          wrapperCol={{ span: 24 }}
                        >
                          <Row>
                            <Col span={8}><Button type="danger" onClick={() => this.deleteOrg(org.id)}>删除部门</Button></Col>
                            <Col span={8}><Button type="primary" onClick={() => this.addResource(org.id)}>添加资源</Button></Col>
                            <Col span={8}><Button type="primary" onClick={() => this.addRawMaterial(org.id)}>添加物资</Button></Col>
                          </Row>
                        </FormItem>
                      </Col>
                    </Row>
                    {org.resource.map((res, resIndex) => {
                      return (
                        <Row>
                          <Col span={4} offset={4}>
                            <FormItem
                              labelCol={{ span: 8 }}
                              wrapperCol={{ span: 14 }}
                              label="所需资源"
                            >
                              <Input
                                placeholder="点击搜索，选择资源"
                                value={res.resourceName}
                                disabled
                                addonAfter={<Icon title="点击搜索，选择资源" type="search" onClick={() => this.searchResource(res.resourceName, org.id, res.id)} />}
                              />
                            </FormItem>
                          </Col>
                          <Col span={4}>
                            <FormItem
                              labelCol={{ span: 8 }}
                              wrapperCol={{ span: 14 }}
                              label="所需数量"
                            >
                              <InputNumber min={0} value={res.useCount} onChange={value => this.resNumChange(value, org.id, res.id)} />
                            </FormItem>
                          </Col>
                          <Col span={4}>
                            <FormItem
                              labelCol={{ span: 0 }}
                              wrapperCol={{ span: 14 }}
                            >
                              <div className={styles.icon} onClick={() => this.deleteResource(org.id, res.id)}>
                                <Icon type="delete" title="删除资源" />
                              </div>
                            </FormItem>
                          </Col>
                        </Row>
                      );
                    })}
                    {org.rawMaterial.map((raw, rawIndex) => {
                      return (
                        <Row>
                          <Col span={4} offset={4}>
                            <FormItem
                              labelCol={{ span: 8 }}
                              wrapperCol={{ span: 14 }}
                              label="所需物质"
                            >
                              <Input
                                placeholder="点击搜索，选择物资"
                                value={raw.materialName}
                                disabled
                                addonAfter={<Icon title="点击搜索，选择物资" type="search" onClick={() => this.searchMaterial(raw.materialName, org.id, raw.id)} />}
                              />
                            </FormItem>
                          </Col>
                          <Col span={4}>
                            <FormItem
                              labelCol={{ span: 8 }}
                              wrapperCol={{ span: 14 }}
                              label="所需数量"
                            >
                              <InputNumber min={0} value={raw.useCount} onChange={value => this.rawNumChange(value, org.id, raw.id)} />
                            </FormItem>
                          </Col>
                          <Col span={4}>
                            <FormItem
                              labelCol={{ span: 0 }}
                              wrapperCol={{ span: 14 }}
                            >
                              <div className={styles.icon} onClick={() => this.deleteRawMaterial(org.id, raw.id)}>
                                <Icon type="delete" title="删除物质" />
                              </div>
                            </FormItem>
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                </div>
              );
            })
            }
            <SelectMaterial
              name={this.state.name}
              visible={this.state.visible}
              resourceType={this.state.resourceType}
              add={this.selectRow}
              handleCancel={this.handleCancel}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}
