import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form, Input, Button, Card, Row, Col, Modal, Popconfirm, message, Divider } from 'antd';
import AddRes from './AddRes';
import styles from './index.less';
import { win12, win16, win10, win3 } from '../../utils/configIndex';

const FormItem = Form.Item;

@connect(({ emgcResource }) => {
  const { data, repeated, userData, functionMenus, emgcResourceInfo } = emgcResource;
  return {
    data,
    repeated,
    userData,
    functionMenus,
    emgcResourceInfo,
  };
})
class FromComponent extends PureComponent {
  state = {
    pagination: {
      pageSize: 5,
      pageNum: 1,
      isQuery: true,
      fuzzy: true,
    },
    showModal: false,
    cacheUser: {},
    isAdd: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    this.getFunctionMenus();
    dispatch({
      type: 'emgcResource/fetchEmgcResourcePage',
      payload: pagination,
    });
  }
  resourceCols = [
    {
      title: '资源名称',
      dataIndex: 'materialName',
      width: win12,
      key: 'materialName',
    }, {
      title: '规格型号',
      dataIndex: 'model',
      width: win12,
      key: 'model',
    }, {
      title: '存放地点',
      dataIndex: 'savePlace',
      width: win16,
      key: 'savePlace',
    }, {
      title: '保管人',
      dataIndex: 'userID',
      width: win10,
      key: 'userID',
      render: (text, record) => {
        return record.baseUserInfo ? record.baseUserInfo.userName : '';
      },
    }, {
      title: '单位',
      dataIndex: 'materialUnit',
      width: win10,
      key: 'materialUnit',
    }, {
      title: '数量',
      dataIndex: 'lastCount',
      width: win10,
      key: 'lastCount',
    }, {
      title: '备注',
      dataIndex: 'remark',
      // width: 380,
      key: 'remark',
    }, {
      title: '操作',
      width: win16,
      fixed: 'right',
      key: 'action',
      render: (text, record) => (
        <span>
          {this.judgeFunction('修改权限') ? (
            <a href="javascript:;" onClick={() => this.getEmgcResourceInfo(record)}>修改</a>
          ) : null}
          {this.judgeFunction('删除权限') ? (
            <span>
              <Divider type="vertical" />
              <Popconfirm title="确定要删除 ?" onConfirm={() => this.delRes(record.toolMaterialInfoID)} okText="确定" cancelText="取消">
                <a>删除</a>
              </Popconfirm>
            </span>
          ) : null}
        </span>
      ),
    }];
  handleSubmit= () => {
    const { form, dispatch } = this.props;
    const value = form.getFieldsValue();
    // 去掉前后空格
    for (const [index, item] of Object.entries(value)) {
      if (item) {
        value[index] = item.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      }
    }
    dispatch({
      type: 'emgcResource/fetchEmgcResourcePage',
      payload: { pageNum: 1, pageSize: 10, isQuery: true, fuzzy: true, ...value },
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'emgcResource/fetchEmgcResourcePage',
      payload: { pageNum: 1, pageSize: 10 },
    });
  };
  handlePageChange = (page, size) => {
    const { form, dispatch } = this.props;
    const { pagination } = this.state;
    pagination.pageNum = page;
    pagination.pageSize = size;
    this.setState({ pagination });
    const value = form.getFieldsValue();
    dispatch({
      type: 'emgcResource/fetchEmgcResourcePage',
      payload: { ...pagination, ...value },
    });
  };
  handleModalVisible = (param) => {
    this.setState({
      showModal: param,
    });
  };
  // 缓存选择的用户 cacheUser
  saveCacheUserData = (cacheUser) => {
    this.setState({
      cacheUser,
    });
  };
  delRes = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emgcResource/delEmgcResource',
      payload: { id },
    }).then(() => {
      message.success('操作成功');
      const { pagination } = this.state;
      dispatch({
        type: 'emgcResource/fetchEmgcResourcePage',
        payload: pagination,
      });
    });
  };
  addRes = () => {
    const { dispatch } = this.props;
    const { form } = this.formRef.props;
    form.validateFields((err, value) => {
      if (err) { return false; }
      // const value = form.getFieldsValue();
      const { cacheUser, isAdd } = this.state;
      value.userID = cacheUser.userID || null;
      const url = isAdd ? 'emgcResource/addEmgcResource' : 'emgcResource/updateEmgcResource';
      dispatch({
        type: url,
        payload: value,
      }).then(() => {
        message.success('操作成功');
      });
      const { pagination } = this.state;
      dispatch({
        type: 'emgcResource/fetchEmgcResourcePage',
        payload: pagination,
      });
      this.handleModalVisible(false);
    });
  };
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'emgcResource/getFunctionMenus',
      payload: { parentCode: functionInfo.functionCode },
    });
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { functionMenus } = this.props;
    const arr = functionMenus.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  // 修改应急资源
  getEmgcResourceInfo = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emgcResource/getEmgcResourceInfo',
      payload: { id: record.toolMaterialInfoID },
    }).then(() => {
      this.setState({
        isAdd: false,
      });
      this.saveCacheUserData(this.props.emgcResourceInfo.baseUserInfo || {})
      this.handleModalVisible(true);
    });
  };
  add = () => {
    this.setState({
      isAdd: true,
    });
    this.handleModalVisible(true);
  };
  render() {
    const { data, form, userData, dispatch, repeated, emgcResourceInfo } = this.props;
    const { getFieldDecorator } = form;
    const { showModal, cacheUser } = this.state;
    return (
      <div className={styles.warp}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={7} sm={24}>
                <FormItem label="资源名称">
                  {getFieldDecorator('materialName')(
                    <Input placeholder="请输入" />
                )}
                </FormItem>
              </Col>
              <Col md={7} sm={24}>
                <FormItem label="存放地点">
                  {getFieldDecorator('savePlace')(
                    <Input placeholder="请输入" />
                )}
                </FormItem>
              </Col>
              <Col md={10} sm={24}>
                <FormItem>
                  {this.judgeFunction('新增权限') ?
                    <Button htmlType="button" icon="plus" type="primary" onClick={this.add}>新增</Button> : null
                  }
                  <Button type="primary" style={{ marginLeft: 8 }} htmlType="submit">查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} htmlType="button">重置</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Table
            dataSource={data.result}
            columns={this.resourceCols}
            scroll={{ x: 1240 + win3 * this.resourceCols.length }}
            pagination={{ total: data.sumCount, pageSize: data.pageSize, pageSizeOptions: ['5', '10', '20', '30'], onShowSizeChange: this.handlePageChange, onChange: this.handlePageChange, showSizeChanger: true, showQuickJumper: true }}
          />
        </Card>
        <Modal
          destroyOnClose
          title="新增"
          visible={showModal}
          onOk={this.addRes}
          // confirmLoading={this.loading.global}
          width="80%"
          onCancel={() => this.handleModalVisible()}
        >
          <AddRes
            cacheUser={cacheUser}
            repeated={repeated}
            getUser={this.getUser}
            dispatch={dispatch}
            userData={userData}
            emgcResourceInfo={emgcResourceInfo}
            wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
            saveCacheUserData={this.saveCacheUserData}
            isAdd={this.state.isAdd}
          />
        </Modal>
      </div>
    );
  }
}
const EmergencyResource = Form.create()(FromComponent);
export default EmergencyResource;

