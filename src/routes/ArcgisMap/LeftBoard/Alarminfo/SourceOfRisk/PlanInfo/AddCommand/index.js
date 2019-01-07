import React, { PureComponent } from 'react';
import { Row, Col, Modal, Form, Input, Select, TreeSelect } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const Option = Select.Option;
@Form.create()
@connect(({ planManagement, emergency }) => ({
  flowNodeList: planManagement.flowNodeList,
  eventID: emergency.eventId,
  executePosition: planManagement.executePosition,
  checkedUser: planManagement.checkedUser,
}))
export default class AddFeature extends PureComponent {
  componentDidMount() {
    // const { dispatch, eventID } = this.props;
    // // 根据eventID获取流程节点
    // dispatch({
    //   type: 'emergency/getFlowNodeList',
    //   payload: { eventID },
    // });
  }
  onChange = (value) => {
    this.props.dispatch({
      type: 'planManagement/saveCheckedUser',
      payload: value,
    });
  };
  render() {
    const { add, handleCancel, visible, form, isAdd } = this.props;
    const { commandInfo = {}, flowNodeList = [] } = this.props;
    return (
      <Modal
        title={isAdd ? '新增预案指令' : '修改预案指令'}
        cancelText="取消"
        okText="保存"
        visible={visible}
        mask={false}
        destroyOnClose
        maskClosable={false}
        onOk={() => add(this.props.form)}
        onCancel={handleCancel}
      >
        <Row type="flex" className={styles.add}>
          {form.getFieldDecorator('commandID', {
            initialValue: isAdd ? '' : (commandInfo.commandID),
          })}
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="流程节点"
            >
              {form.getFieldDecorator('flowNodeID', {
                initialValue: isAdd ? '' : (commandInfo.flowNodeID),
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
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
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
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
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
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="执行岗位"
            >
              {form.getFieldDecorator('executePostion', {
                initialValue: isAdd ? [] : commandInfo.executePostion,
                rules: [],
              })(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择执行岗位"
                >
                  {this.props.executePosition.map(item => (
                    <Option
                      value={item.orgPostionID}
                      key={item.orgPostionID}
                    >
                      {item.postionName}
                    </Option>
                  ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="执行时长"
            >
              {form.getFieldDecorator('executeTime', {
                initialValue: isAdd ? '' : commandInfo.executeTime,
                rules: [],
              })(
                <Input placeholder="请输入执行时长" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
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
      </Modal>
    );
  }
}
