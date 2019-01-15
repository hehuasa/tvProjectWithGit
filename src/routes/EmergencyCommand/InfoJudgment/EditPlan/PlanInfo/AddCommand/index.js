import React, { PureComponent } from 'react';
import { Row, Col, Modal, Form, Input, Select, TreeSelect, Card, Table, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { commandType } from '../../../../../../utils/utils';
import { win3, win12, win20, win10 } from '../../../../../../configIndex';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const Option = Select.Option;
const SearchArea = Form.create()((props) => {
  const { form, handleSearch, handleFormReset } = props;
  const { getFieldDecorator } = form;
  const formReset = () => {
    form.resetFields();
    handleFormReset();
  };
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
                <Input placeholder="请输入指令内容" style={{ width: '100%' }} />
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
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  <Option value={1}>指令</Option>
                  <Option value={2}>通知</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <span className={styles.submitButtons}>
              <Button style={{ marginLeft: 16 }} onClick={() => handleSearch(form)}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => formReset()}>重置</Button>
            </span>
          </Col>
        </Row>
      </div>
    </Form>
  );
});
@Form.create()
@connect(({ emergency }) => ({
  flowNodeList: emergency.flowNodeList,
  eventID: emergency.eventId,
  commandReceiver: emergency.commandReceiver,
  checkedUser: emergency.checkedUser,
  existCommandPage: emergency.existCommandPage,
  allCommandModelList: emergency.allCommandModelList,
}))
export default class AddFeature extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 5,
    total: 0,
  };
  componentDidMount() {
    const { dispatch, eventID } = this.props;
    // 根据eventID获取应急人员
    dispatch({
      type: 'emergency/getCommandReceiverList',
      payload: { eventID, name: null },
    });
    // 获取指令所有分类
    dispatch({
      type: 'emergency/allCommandModelList',
    });
    const { pageNum, pageSize } = this.state;
    // 获取已有指令列表
    this.page(pageNum, pageSize);
  }
  onChange = (value) => {
    this.props.dispatch({
      type: 'emergency/saveCheckedUser',
      payload: value,
    });
  };
  getUserName = (item) => {
    const orgName = item.organization ? item.organization.orgnizationName : '';
    const postionName = item.basePostionInfo ? item.basePostionInfo.postionName : '';
    return `${orgName} ${postionName}`;
  };
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
  // 搜索
  handleSearch = (form) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        pageNum: 1,
        pageSize: 5,
        isQuery: true,
        fuzzy: true,
      };
      // 防止将空作为查询条件
      for (const obj in values) {
        if (values[obj] === '' || values[obj] === undefined) {
          delete values[obj];
        }
      }
      const search = {};
      Object.assign(search, values);
      this.props.dispatch({
        type: 'emergency/selectExistCommand',
        payload: search,
      }).then(() => {
        this.setState({
          pageNum: this.props.existCommandPage.pageNum,
          pageSize: this.props.existCommandPage.pageSize,
          total: this.props.existCommandPage.sumCount,
        });
      });
    });
  };
  // 重置查询
  handleFormReset = () => {
    this.page(1, 5);
  };
  // 清空
  resetCommand = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
  };
  render() {
    const { add, handleCancel, visible, form, isAdd } = this.props;
    const { commandInfo, flowNodeList } = this.props;
    // 指令表头
    const commandCols = [
      {
        title: '指令类型',
        dataIndex: 'commandType',
        width: win12,
        key: 'commandType',
        render: (text) => {
          return commandType(text);
        },
      }, {
        title: '指令分类',
        dataIndex: 'commandModelName',
        width: win12,
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
        title: '排列序号',
        dataIndex: 'executeIndex',
        width: 100,
        key: 'executeIndex',
      }, {
        title: '注意事项',
        dataIndex: 'attention',
        // width: win20,
        key: 'attention',
      }];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const command = selectedRows[0];
        const arr = [];
        if (command.excutePostionList) {
          command.excutePostionList.forEach((item) => {
            if (this.props.commandReceiver.filter(reciver => reciver.orgPostionID === item.orgPostionID).length > 0) {
              arr.push(item.orgPostionID);
            }
          });
        }
        this.props.form.setFieldsValue({
          // flowNodeID: command.flowNodeID,
          commandType: command.commandType,
          commandContent: command.commandContent,
          executePostion: arr,
          executeTime: command.executeTime,
          attention: command.attention,
        });
      },
      type: 'radio',
    };
    return (
      <Modal
        title={isAdd ? '新增预案指令' : '修改预案指令'}
        cancelText="取消"
        okText="保存"
        visible={visible}
        width="90%"
        mask={false}
        destroyOnClose
        maskClosable={false}
        footer={false}
        onCancel={handleCancel}
      >
        <div className={styles.insert}>
          <Card bordered={false}>
            <Row>
              <Col span={8}>
                <Card title="指令插入">
                  <Form onSubmit={this.handleSearch}>
                    <Row type="flex" justify="center">
                      <span>
                        {form.getFieldDecorator('cmdExecID', {
                          initialValue: isAdd ? '' : (commandInfo.cmdExecID),
                        })}
                      </span>
                      <Col md={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="流程节点"
                        >
                          {form.getFieldDecorator('flowNodeID', {
                          initialValue: isAdd ? '' : (commandInfo.flowNodeID),
                            rules: [
                              { required: true, message: '流程节点不能为空' },
                            ],
                        })(
                          <Select placeholder="请选择" style={{ width: '100%' }}>
                            <Option value="">请选择</Option>
                            {flowNodeList.map(type => (
                              <Option
                                key={type.flowNodeID}
                                value={type.flowNodeID}
                              >
                                {type.nodeName}
                              </Option>
                            ))}
                          </Select>
                        )}
                        </FormItem>
                      </Col>
                      <Col md={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="指令类型"
                        >
                          {form.getFieldDecorator('commandType', {
                          initialValue: isAdd ? '' : commandInfo.commandType,
                          rules: [
                            { required: true, message: '指令类型不能为空' },
                          ],
                        })(
                          <Select placeholder="请选择" style={{ width: '100%' }}>
                            <Option value="">请选择</Option>
                            <Option value={1}>指令</Option>
                            <Option value={2}>通知</Option>
                          </Select>
                        )}
                        </FormItem>
                      </Col>
                      <Col md={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="指令分类"
                        >
                          {form.getFieldDecorator('commandModel', {
                          initialValue: isAdd ? '' : commandInfo.commandModel,
                          rules: [
                            { required: true, message: '指令分类不能为空' },
                          ],
                        })(
                          <Select placeholder="请选择" style={{ width: '100%' }}>
                            <Option value="">请选择</Option>
                            {this.props.allCommandModelList.map(type => (
                              <Option
                                key={type.commandModelID}
                                value={type.modelCode}
                              >{type.modelName}
                              </Option>
                            ))}
                          </Select>
                        )}
                        </FormItem>
                      </Col>
                      <Col md={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="指令内容"
                        >
                          {form.getFieldDecorator('commandContent', {
                          initialValue: isAdd ? '' : commandInfo.commandContent,
                          rules: [
                            { required: true, message: '指令内容不能为空' },
                          ],
                        })(
                          <TextArea row={4} placeholder="请输入指令内容" />
                        )}
                        </FormItem>
                      </Col>
                      <Col md={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="执行岗位"
                        >
                          {form.getFieldDecorator('executePostion', {
                          initialValue: isAdd ? '' : this.props.checkedUser,
                          // initialValue: isAdd ? '' : commandInfo.executePostion,
                          rules: [],
                        })(
                          <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择岗位"
                            allowClear
                            treeCheckable
                            treeNodeFilterProp="title"
                            onChange={this.onChange}
                          >
                            { this.props.commandReceiver.map(item => (
                              <TreeNode
                                value={item.orgPostionID}
                                title={item.postionName}
                                key={item.orgPostionID}
                              />
                            ))
                            }
                          </TreeSelect>
                        )}
                        </FormItem>
                      </Col>
                      <Col md={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="执行时长(分钟)"
                        >
                          {form.getFieldDecorator('executeTime', {
                          initialValue: isAdd ? '' : commandInfo.executeTime,
                          rules: [
                            { pattern: /^[0-9]*$/, message: '请输入有效数字' },
                          ],
                        })(
                          <Input placeholder="请输入执行时长（分钟）" />
                        )}
                        </FormItem>
                      </Col>
                      <Col md={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="排列序号"
                        >
                          {form.getFieldDecorator('executeIndex', {
                            initialValue: isAdd ? '' : commandInfo.executeIndex,
                            rule: [{
                              type: 'integer', message: '请输入正确的数字', transform(value) { if (value) { return Number(value); } },
                            }],
                          })(
                            <Input placeholder="请输入排列序号" />
                          )}
                        </FormItem>
                      </Col>
                      <Col md={24}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 15 }}
                          label="注意事项"
                        >
                          {form.getFieldDecorator('attention', {
                          initialValue: isAdd ? '' : commandInfo.attention,
                          rules: [],
                        })(
                          <TextArea placeholder="请输入注意事项" rows={4} />
                        )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Form>
                  <div className={styles.footer}>
                    <Button onClick={this.resetCommand}>清空</Button>
                    <Button type="primary " onClick={() => add(this.props.form, this.props.checkedUser)}>保存</Button>
                  </div>
                </Card>
              </Col>
              <Col span={15} offset={1}>
                <Card title="已有指令选择">
                  <SearchArea
                    handleSearch={this.handleSearch}
                    handleFormReset={this.handleFormReset}
                  />
                  <div className={styles.table}>
                    <Table
                      columns={commandCols}
                      rowSelection={rowSelection}
                      pagination={{
                        onChange: this.page,
                        current: this.state.pageNum,
                        pageSize: this.state.pageSize,
                        total: this.state.total,
                  }}
                      dataSource={this.props.existCommandPage.result}
                      rowKey="commandID"
                      scroll={{ x: 960 + win3 * commandCols.length }}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </Modal>
    );
  }
}
