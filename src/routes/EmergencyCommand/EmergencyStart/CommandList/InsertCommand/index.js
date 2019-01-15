import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, TreeSelect, Button, Card, Table, Select } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { commandType } from '../../../../../utils/utils';
import AcceptUser from '../AcceptUser/index';
import { win3, win8, win10, win20, win12 } from '../../../../../configIndex';

const { TreeNode } = TreeSelect;
const FormItem = Form.Item;
const Option = Select.Option;
const SearchArea = Form.create()((props) => {
  const { form, handleSearch, handleFormReset } = props;
  const { getFieldDecorator } = form;
  return (
    <Form>
      <div className={styles.search}>
        <Row>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="指令内容"
            >
              {getFieldDecorator('commandContent')(
                <Input placeholder="请输入指令内容" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="指令类型"
            >
              {getFieldDecorator('commandType')(
                <Select placeholder="请选择" style={{ minWidth: 100 }}>
                  <Option value="">请选择</Option>
                  <Option value={1}>指令</Option>
                  <Option value={2}>通知</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={() => handleSearch(form)}>查询</Button>
              <Button onClick={() => handleFormReset(form)}>重置</Button>
            </span>
          </Col>
        </Row>
      </div>
    </Form>
  );
});
@connect(({ emergency }) => ({
  flowNodeList: emergency.flowNodeList,
  eventID: emergency.eventId,
  viewNodeType: emergency.viewNodeType,
  existCommandPage: emergency.existCommandPage,
  allCommandModelList: emergency.allCommandModelList,
  commandReceiver: emergency.commandReceiver,
  acceptUser: emergency.acceptUser,
}))
@Form.create()
export default class InsertCommand extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 5,
    total: 0,
    value: '',
    checkedUser: [],
    visible: false,
    searchValue: {},
  };
  componentDidMount() {
    const { dispatch, eventID } = this.props;
    // 获取指令所有分类
    dispatch({
      type: 'emergency/allCommandModelList',
    });
    // 根据eventID获取应急人员
    dispatch({
      type: 'emergency/getCommandReceiverList',
      payload: { eventID, name: null },
    });
    const { pageNum, pageSize } = this.state;
    // 获取已有指令列表
    this.page(pageNum, pageSize);
  }
  page = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergency/selectExistCommand',
      payload: { pageNum, pageSize },
    }).then(() => {
      this.setState({
        pageNum: this.props.existCommandPage.pageNum,
        pageSize: this.props.existCommandPage.pageSize,
        total: this.props.existCommandPage.sumCount,
      });
    });
  };
  // 新增指令
  add = () => {
    const { dispatch, form, eventID, acceptUser } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const userList = [];
      acceptUser.forEach((obj, i) => {
        if (obj.type === 0) {
          userList.push(obj);
        }
      });
      dispatch({
        type: 'emergency/addCommandInfo',
        payload: {
          ...fieldsValue,
          eventID,
          userList: JSON.stringify(userList),
          userJson: JSON.stringify(this.state.checkedUser)
        },
      }).then(() => {
        this.resetAcceptUser();
        dispatch({
          type: 'emergency/saveIsInsert',
          payload: false,
        });
        dispatch({
          type: 'emergency/getCommandList',
          payload: { eventID, nodeType: this.props.viewNodeType },
        });
        // 获取指令分类下拉列表
        dispatch({
          type: 'emergency/getCommandModelList',
          payload: { eventID, nodeType: this.props.viewNodeType },
        });
      });
    });
  };
  // 返回到指令列表
  backToList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergency/saveIsInsert',
      payload: false,
    });
    this.resetAcceptUser();
  };
  // 搜索
  handleSearch = (form) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { dispatch } = this.props;
      this.setState({
        searchValue: fieldsValue,
      });
      dispatch({
        type: 'emergency/selectExistCommand',
        payload: { pageNum: 1, pageSize: 5, ...fieldsValue, isQuery: true, fuzzy: true },
      }).then(() => {
        this.setState({
          pageNum: this.props.existCommandPage.pageNum,
          pageSize: this.props.existCommandPage.pageSize,
          total: this.props.existCommandPage.sumCount,
        });
      });
    });
  };
  handleFormReset = (form) => {
    form.resetFields();
    this.setState({
      searchValue: {},
    });
    this.page(1, 10);
  };
  // 已有指令分页列表
  pageChange = (pageNum, pageSize) => {
    this.props.dispatch({
      type: 'emergency/selectExistCommand',
      payload: { pageNum, pageSize, ...this.state.searchValue, fuzzy: true, isQuery: true },
    }).then(() => {
      this.setState({
        pageNum: this.props.existCommandPage.pageNum,
        pageSize: this.props.existCommandPage.pageSize,
        total: this.props.existCommandPage.sumCount,
      });
    });
  };
  // 清空添加的指令
  resetCommand = () => {
    this.props.form.resetFields();
    this.resetAcceptUser();
  };
  // 重置接收人员
  resetAcceptUser = () => {
    this.props.dispatch({
      type: 'emergency/saveAcceptUser',
      payload: [],
    });
  };
  // 选中已有指令
  onSelect = (value, node) => {
    const arr = this.state.checkedUser;
    if (node.props.children && node.props.children.length > 0) {
      node.props.children.forEach((child) => {
        const exist = this.state.checkedUser.find(tag => tag === child.key);
        if (!node.props.checked) {
          if (!exist) {
            arr.push(child.key);
            this.setState({
              checkedUser: arr,
            });
          }
        } else if (exist) {
          this.setState({
            checkedUser: arr.filter(tag => tag !== child.key),
          });
        }
      });
    } else {
      const exist = this.state.checkedUser.find(tag => tag === node.props.eventKey);
      if (!node.props.checked) {
        if (!exist) {
          arr.push(node.props.eventKey);
          this.setState({
            checkedUser: arr,
          });
        }
      } else if (exist) {
        this.setState({
          checkedUser: arr.filter(tag => tag !== node.props.eventKey),
        });
      }
    }
  };
  onChange = (value) => {
    this.setState({ value });
    this.props.form.setFieldsValue({
      executePostion: value,
    });
  };
  // 获取指令执行人名字
  getUserName = (item) => {
    const orgName = item.organization ? item.organization.orgnizationName : '';
    const postionName = item.basePostionInfo ? item.basePostionInfo.postionName : '';
    return `${orgName} ${postionName}`;
  };
  // 指令接收人弹窗打开
  showModal = () => {
    const { acceptUser } = this.props;
    if (acceptUser.length > 0) {
      const userList = [];
      const mobileList = [];
      const selectedRowKeys = [];
      acceptUser.forEach((obj) => {
        if (obj.userID !== undefined && obj.userID !== null) {
          userList.push(obj);
          selectedRowKeys.push(obj.userID);
        }
        if (obj.uuID !== undefined && obj.uuID !== null) {
          mobileList.push(obj);
        }
      });
      this.child.initData(userList, mobileList, selectedRowKeys);
    }
    this.setState({
      visible: true,
    });
  };
  // 指令接收人弹窗关闭
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  childRef = (ref) => {
    this.child = ref;
  };
  render() {
    const { form, allCommandModelList } = this.props;
    const { getFieldDecorator } = form;
    // 指令表头
    const commandCols = [
      {
        title: '流程节点',
        dataIndex: 'nodeName',
        width: win10,
        key: 'nodeName',
        render: (text, record) => {
          return record.planFlowNode ? (record.planFlowNode.nodeName || '') : '';
        },
      }, {
        title: '指令类型',
        dataIndex: 'commandType',
        width: win10,
        key: 'commandType',
        render: (text) => {
          return commandType(text);
        },
      }, {
        title: '指令内容',
        dataIndex: 'commandContent',
        width: win20,
        key: 'commandContent',
      }, {
        title: '执行岗位',
        dataIndex: 'excutePostionList',
        width: win12,
        key: 'excutePostionList',
        render: (text) => {
          let str = '';
          if (text && text.length > 0) {
            text.forEach((item, index) => {
              if (index !== text.length - 1) {
                str = `${str + item.postionName}, `;
              } else {
                str += item.postionName;
              }
            });
          }
          return str;
        },
      }, {
        title: '执行时长',
        dataIndex: 'executeTime',
        width: win10,
        key: 'executeTime',
      }, {
        title: '注意事项',
        dataIndex: 'attention',
        // width: win20,
        key: 'attention',
      }];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const command = selectedRows[0];
        this.props.form.setFieldsValue({
          commandType: command.commandType,
          commandModel: command.commandModel,
          commandContent: command.commandContent,
          executeTime: command.executeTime,
          attention: command.attention,
        });
      },
      type: 'radio',
    };
    return (
      <div className={styles.insert}>
        <Card bordered={false}>
          <Row>
            <Col span={8}>
              <div className={styles.insertCon}>
                <Card title="指令插入">
                  <Form onSubmit={this.handleSearch}>
                    <Row type="flex" justify="center" className={styles.insertCard}>
                      <div>{getFieldDecorator('nodeType', { initialValue: this.props.viewNodeType })(
                        <Input type="hidden" />
                      )}
                      </div>
                      <Col sm={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="指令类型"
                        >
                          {getFieldDecorator('commandType', {
                          })(
                            <Select placeholder="请选择" style={{ width: '100%' }}>
                              <Option value="">请选择</Option>
                              <Option value={1}>指令</Option>
                              <Option value={2}>通知</Option>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col sm={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="指令分类"
                        >
                          {getFieldDecorator('commandModel', {
                          })(
                            <Select placeholder="请选择" style={{ width: '100%' }}>
                              <Option value="">请选择</Option>
                              {allCommandModelList.map(type =>
                                <Option key={type.commandModelID} value={type.modelCode}>{type.modelName}</Option>
                              )}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col sm={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="指令内容"
                        >
                          {getFieldDecorator('commandContent', {
                            rules: [
                              { required: true, message: '指令内容必填' },
                            ],
                          })(
                            <Input.TextArea row={4} placeholder="请输入指令内容" />
                          )}
                        </FormItem>
                      </Col>
                      <Col sm={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="执行岗位"
                        >
                          {getFieldDecorator('executePostion', {
                          })(
                            <TreeSelect
                              showSearch
                              style={{ width: '100%' }}
                              // value={this.state.value}
                              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                              placeholder="请选择岗位"
                              allowClear
                              treeCheckable
                              onChange={this.onChange}
                              onSelect={this.onSelect}
                            >
                              {this.props.commandReceiver.map(item => (
                                <TreeNode
                                  value={item.postionName}
                                  title={item.postionName}
                                  key={item.orgPostionID}
                                />
                              ))
                              }
                            </TreeSelect>
                          )}
                        </FormItem>
                      </Col>
                      <Col sm={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="指令接收人"
                        >
                          <AcceptUser
                            visible={this.state.visible}
                            hideModal={this.hideModal}
                            childRef={this.childRef}
                          />
                          <Button type="primary" size="small" onClick={this.showModal}>选择接收人</Button>
                        </FormItem>
                      </Col>
                      <Col sm={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="执行时长"
                        >
                          {getFieldDecorator('executeTime', {
                            rules: [
                              { pattern: /^[0-9]*$/, message: '请输入有效数字' },
                            ],
                          })(
                            <Input placeholder="请输入执行时长(分钟)" />
                          )}
                        </FormItem>
                      </Col>
                      <Col sm={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="注意事项"
                        >
                          {getFieldDecorator('attention')(
                            <Input.TextArea placeholder="请输入注意事项" rows={4} />
                          )}
                        </FormItem>
                      </Col>
                      <Col sm={24}>
                        <div className={styles.footer}>
                          <Button onClick={this.resetCommand}>清空</Button>
                          <Button onClick={this.backToList}>返回</Button>
                          <Button type="primary" onClick={this.add}>确定</Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </div>
            </Col>
            <Col span={15} offset={1}>
              <Card title="已有指令选择">
                <SearchArea
                  handleSearch={this.handleSearch}
                  handleFormReset={this.handleFormReset}
                />
                <div className={styles.commandtable}>
                <Table
                  columns={commandCols}
                  rowSelection={rowSelection}
                  pagination={{
                    onChange: this.pageChange,
                    current: this.state.pageNum,
                    pageSize: this.state.pageSize,
                    total: this.state.total,
                  }}
                  dataSource={this.props.existCommandPage.result}
                  rowKey={record => record.commandID}
                  scroll={{ x: 1200 + win3 * commandCols.length }}
                />
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
