import React, { PureComponent } from 'react';
import { TreeSelect, Form, Table, Row, Col, Input, Button, Modal, Select } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { win15 } from '../../utils/configIndex';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;
const columnsTitle = () => {
  return (
    [{
      title: '机构名称',
      dataIndex: 'organization',
      width: win15,
      render: (text) => {
        return text ? text.orgnizationName : '';
      },
    }, {
      title: '事发区域',
      dataIndex: 'area',
      width: win15,
      render: (text) => {
        return text ? text.areaName : '';
      },
    }, {
      title: '资源名称',
      dataIndex: 'resourceName',
      width: win15,
    }, {
      title: '规格型号',
      dataIndex: 'specification',
      width: win15,
    }, {
      title: '所属专业',
      dataIndex: 'professionSystemName',
      width: win15,
    }, {
      title: '工艺位号',
      dataIndex: 'processNumber',
      width: win15,
    }, {
      title: '安装位置',
      dataIndex: 'installPosition',
      // width: win15,
    }]
  );
};
const columnsTitleWZ = () => {
  return (
    [{
      title: '原料名称',
      dataIndex: 'rawMaterialName',
      width: win15,
    }, {
      title: '相对密度',
      dataIndex: 'relativeDensity',
      width: win15,
    }, {
      title: '相对蒸汽密度',
      dataIndex: 'relativeSteamDensity',
      width: win15,
    }, {
      title: '爆炸范围',
      dataIndex: 'explosionRange',
      width: win15,
    }, {
      title: '爆炸零界点',
      dataIndex: 'explosionPoint',
      width: win15,
    }, {
      title: '溶解性',
      dataIndex: 'solubility',
      width: win15,
    }, {
      title: '外观',
      dataIndex: 'shape',
      width: win15,
    }, {
      title: '健康危害',
      dataIndex: 'healthHazards',
      width: win15,
    }, {
      title: '物料类型',
      dataIndex: 'rawType',
      // width: win15,
    }]
  );
};
const { Option } = Select;
@Form.create()
export default class CommonQuery extends PureComponent {
  state = {
    orgDisabled: false,
    areaDisabled: false,
  }
  componentDidMount() {
    if (this.props.onRef) { this.props.onRef(this); }
    // 获取专业系统列表
    this.props.dispatch({
      type: 'alarmDeal/professionList',
    });
    // 获取装置列表
    this.props.dispatch({
      type: 'alarmDeal/getAreaList',
      payload: { areaType: 111.101 },
    });
    this.props.form.setFieldsValue({
      orgID: this.props.orgID,
    });
  }
  onhandleTableChange = (pagination, filtersArg, sorter) => {
    const { monitor } = this.props;
    if (!this.props.isUsePage) {
      const { form } = this.props;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        if (this.props.whether) {
          this.props.dispatch({
            type: 'alarmDeal/getResourceQueryPage',
            payload: {
              pageNum: pagination.current,
              pageSize: pagination.pageSize,
              monitor,
              resourceName: fieldsValue.resourceName,
              specialties: fieldsValue.specialties,
              profession: fieldsValue.profession,
              resourceClassify: fieldsValue.resourceClassify,
              installPosition: fieldsValue.installPosition,
              areaID: fieldsValue.areaID,
              orgID: fieldsValue.orgID,
            },
          });
        } else {
          this.props.dispatch({
            type: 'alarmDeal/getMaterialPage',
            payload: {
              pageNum: pagination.current,
              pageSize: pagination.pageSize,
              isQuery: true,
              fuzzy: true,
              rawMaterialName: fieldsValue.rawMaterialName,
            },
          });
        }
      });
    }
  }
  onHandleSearch = (e) => {
    e.preventDefault();
    const { form, useChangePage, monitor } = this.props;
    if (useChangePage) { useChangePage(); }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.dispatch({
        type: 'alarmDeal/getResourceQueryPage',
        payload: {
          pageNum: 1,
          pageSize: 10,
          monitor,
          resourceName: fieldsValue.resourceName,
          profession: fieldsValue.profession,
          resourceClassify: fieldsValue.resourceClassify,
          installPosition: fieldsValue.installPosition,
          areaID: fieldsValue.areaID,
          orgID: fieldsValue.orgID,
        },
      });
    });
  };
  onSearchMaterial = (e) => {
    e.preventDefault();
    const { form, useChangePage } = this.props;
    if (useChangePage) { useChangePage(); }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.dispatch({
        type: 'alarmDeal/getMaterialPage',
        payload: {
          pageNum: 1,
          pageSize: 10,
          isQuery: true,
          fuzzy: true,
          rawMaterialName: fieldsValue.rawMaterialName,
        },
      });
    });
  };
  onHandleFormReset = (e) => {
    e.preventDefault();
    const { form, useChangePage } = this.props;
    if (useChangePage) { useChangePage(); }
    form.setFieldsValue({
      resourceName: '',
      specialties: '',
      resourceClassify: '',
      installPosition: '',
      orgID: null,
      areaID: null,
      rawMaterialName: null,
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (this.props.whether) {
        this.props.dispatch({
          type: 'alarmDeal/getResourceQueryPage',
          payload: {
            pageNum: 1,
            pageSize: 10,
          },
        });
      } else {
        this.props.dispatch({
          type: 'alarmDeal/getMaterialPage',
          payload: {
            pageNum: 1,
            pageSize: 10,
          },
        });
      }
    });
  };
  setOrgID = (orgID) => {
    this.props.form.setFieldsValue({ orgID });
    if (orgID) {
      this.setState({
        orgDisabled: true,
      });
    }
  };
  setAreaID = (areaID) => {
    this.props.form.setFieldsValue({ areaID });
    if (areaID) {
      this.setState({
        areaDisabled: true,
      });
    }
  };

  render() {
    const { form } = this.props;
    const alarmEventInfoData = {};
    const { title, searchValue, whether, clickWhether, visible, onHandleOk,
      onHandleCancel, rowSelection, alarmDeal, orgTree } = this.props;
    let columns = null;
    let newPagination = {};
    let scroll_x = 0;
    if (clickWhether === 1 || clickWhether === 2) {
      columns = columnsTitle();
      scroll_x = 1500 + columns.length;
    } else if (clickWhether === 3) {
      columns = columnsTitleWZ();
      scroll_x = 1600 + columns.length;
    }
    if (!alarmDeal.pagination.current && !alarmDeal.pagination.pageSize && !alarmDeal.pagination.total) {
      newPagination = {};
    } else {
      newPagination = alarmDeal.pagination;
    }
    const renderTreeNodes = (data) => {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.orgnizationName} key={item.orgID} value={`${item.orgID}`} >
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.orgnizationName} key={item.orgID} value={`${item.orgID}`} />;
      });
    };
    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          onOk={onHandleOk}
          onCancel={onHandleCancel}
          mask={false}
          style={{ position: 'absolute', left: 260 }}
          destroyOnClose
          width="80%"
          zIndex="1002"
          bodyStyle={{ maxHeight: 600, overflow: 'auto' }}
        >
          {
            whether ? (
              <div className={styles.tableListForm}>
                <Form layout="inline" >
                  <Row type="flex" gutter={{ md: 8, lg: 24, xl: 48 }} >
                    <Col md={6} sm={24}>
                      <FormItem
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                        label="所属部门"
                      >
                        {form.getFieldDecorator('orgID', {
                        })(
                          <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择事发部门"
                            disabled={this.state.orgDisabled}
                            treeNodeFilterProp="title"
                            allowClear
                            treeDefaultExpandAll
                          >
                            {renderTreeNodes(alarmDeal.apparatusList)}
                          </TreeSelect>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                      <FormItem
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                        label="事发区域"
                      >
                        {form.getFieldDecorator('areaID', {
                        })(
                          <Select
                            placeholder="请选择事发区域"
                            onChange={this.handleChange}
                            optionFilterProp="title"
                            disabled={this.state.areaDisabled}
                            showSearch
                            style={{ width: '100%' }}
                          >
                            <Option value="">请选择</Option>
                            {alarmDeal.areaList.map(item => (
                              <Option
                                key={item.areaID}
                                value={item.areaID}
                                title={item.areaName}
                              >{item.areaName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                      <FormItem
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                        label="资源名称"
                      >
                        {form.getFieldDecorator('resourceName', {
                          initialValue: searchValue,
                        })(
                          <Input
                            placeholder="请输入资源名称"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                      <FormItem
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                        label="所属专业"
                      >
                        {form.getFieldDecorator('profession', {
                        })(
                          <Select placeholder="请选择" style={{ width: '100%' }}>
                            <Option value="">请选择</Option>
                            {alarmDeal.professionList.map(item => (
                              <Option
                                key={item.professionSystemID}
                                value={item.professionSystemCode}
                              >{item.professionSystemName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                      <FormItem
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                        label="安装位置"
                      >
                        {form.getFieldDecorator('installPosition', {
                          initialValue: alarmEventInfoData.alarmStatue,
                        })(
                          <Input placeholder="请输入安装位置" />
                        )}
                      </FormItem>
                    </Col>
                    <Col >
                      <Button type="primary" onClick={this.onHandleSearch}>搜索</Button>
                      {/* <Button style={{ marginLeft: 8 }} onClick={this.onHandleFormReset}>重置</Button> */}
                    </Col>
                  </Row>
                </Form>
              </div>
            ) : (
                <div className={styles.tableListForm}>
                  <Form layout="inline" >
                    <Row type="flex" gutter={{ md: 8, lg: 24, xl: 48 }} >
                      <Col md={6} sm={24}>
                        <FormItem
                          labelCol={{ span: 7 }}
                          wrapperCol={{ span: 15 }}
                          label="物料名称"
                        >
                          {form.getFieldDecorator('rawMaterialName', {
                          })(
                            <Input placeholder="请输入物料名称" />
                          )}
                        </FormItem>
                      </Col>
                      <Col >
                        <Button type="primary" onClick={this.onSearchMaterial}>搜索</Button>
                        {/* <Button style={{ marginLeft: 8 }} onClick={this.onHandleFormReset}>重置</Button> */}
                      </Col>
                    </Row>
                  </Form>
                </div>
              )
          }
          <Table
            columns={columns}
            dataSource={alarmDeal.searchList}
            pagination={newPagination}
            rowSelection={rowSelection}
            onChange={this.onhandleTableChange}
            rowKey={record => record.gISCode}
            scroll={{ x: scroll_x, y: 290 }}
          />

        </Modal>

      </div>
    );
  }
}
