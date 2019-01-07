import React, { PureComponent } from 'react';
import { Row, Col, Modal, Form, Input, Select } from 'antd';
// import styles from './index.less';
import { commonData } from '../../../../../../../mock/commonData';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@Form.create()
export default class AddFeature extends PureComponent {
  render() {
    const { add, handleCancel, visible, form, isAdd } = this.props;
    return (
      <Modal
        title={isAdd ? '新增事件特征' : '修改事件特征'}
        cancelText="取消"
        okText="保存"
        visible={visible}
        mask={false}
        maskClosable={false}
        onOk={() => add(this.props.form)}
        onCancel={handleCancel}
      >
        <Row type="flex">
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="特征编号"
            >
              {form.getFieldDecorator('featureCode', {
                rules: [
                  { required: true, message: '特征编号不能为空' },
                  { pattern: /^[A-Za-z0-9_]+$/, message: '只能由英文、数字、下划线组成' },
                ],
              })(
                <Input placeholder="请输入特征编号" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="特征类型"
            >
              {form.getFieldDecorator('featureType', {
                rules: [
                  { required: true, message: '特征类型不能为空' },
                ],
              })(
                <Input placeholder="请输入特征类型" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="特征名称"
            >
              {form.getFieldDecorator('featureName', {
                rules: [
                  { required: true, message: '特征名称不能为空' },
                  { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/, message: '只能由中文、英文、数字、下划线组成' },
                ],
              })(
                <Input placeholder="请输入特征名称" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="特征规则"
            >
              {form.getFieldDecorator('rule', {
                rules: [
                  { required: true, message: '特征规则不能为空' },
                ],
              })(
                <Select placeholder="请选择规则" style={{ width: '100%' }} >
                  {
                    commonData.featureRuleList.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="特征值"
            >
              {form.getFieldDecorator('featureValue', {
                rules: [
                  { required: true, message: '特征值不能为空' },
                  { pattern: /^[0-9]*$/, message: '只能为数字' },
                ],
              })(
                <Input placeholder="请输入特征值" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="计量单位"
            >
              {form.getFieldDecorator('unit', {
                rules: [],
              })(
                <Input placeholder="请输入单位" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="权重"
            >
              {form.getFieldDecorator('weight', {
                rules: [],
              })(
                <Input placeholder="请输入权重" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="特征描述"
            >
              {form.getFieldDecorator('desc', {
                rules: [],
              })(
                <TextArea placeholder="请输入特征描述" rows={4} />
              )}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}
