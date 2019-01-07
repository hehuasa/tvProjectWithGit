import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Form, Input, Select } from 'antd';
import styles from './AddPlan.less';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

let timeout;

const planStatu = [{
  name: '启用',
  key: 0,
}, {
  name: '停用',
  key: 1,
}, {
  name: '发布',
  key: 2,
}, {
  name: '草稿',
  key: 3,
},]

@connect(({ planManagement, }) => ({
  planLevelList: planManagement.planLevelData,
  planBasicInfo: planManagement.planBasicInfo,
  preplanType: planManagement.preplanType,
  publisher: planManagement.publisher,
  planCodeToggle: planManagement.planCodeToggle,
}))
@Form.create()
export default class AddPlan extends PureComponent {

  state = {
    feature: null,
  }

  componentDidMount() {
    // 请求预案级别
    this.props.dispatch({
      type: 'planManagement/planLevelData',
    });

    // 请求预案类型
    this.props.dispatch({
      type: 'planManagement/preplanType',
    });

    // 编制部门就是发布机构
    this.props.dispatch({
      type: 'planManagement/getPublisher',
    });
  }
  // Function({ fieldName: { value: any, errors: Error } })

  fake = (value) => {
    const payload = {
      planCode: value,
      planInfoID: this.props.planBasicInfo.planInfoID,
    }
    if (!payload.planInfoID) {
      delete payload.planInfoID;
    }
    this.props.dispatch({
      type: 'planManagement/selectPlanCode',
      payload,
    }).then(() => {
      const { planCodeToggle, form, onPlanCodeToggle } = this.props;
      if (planCodeToggle === 1001) {
        form.setFields({
          planCode: {
            value: value,
          }
        })
        onPlanCodeToggle(true)
      } else {
        form.setFields({
          planCode: {
            value: value,
            errors: [new Error('唯一字段已经存在')],
          }
        })
        onPlanCodeToggle(false)
      }
    });
  }
  fetch = (value, callback) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => this.fake(value), 500);
  }
  // 筛选唯一字段
  onChangePlanCode = (e) => {
    const { value } = e.target;
    this.fetch(value);
  }

  render() {
    const { add, handleCancel, visible, form, isAdd, planBasicInfo,
      planLevelList, preplanType, publisher } = this.props;
    return (
      <Modal
        title={isAdd ? '新增预案基本信息' : '修改预案基本信息'}
        cancelText="取消"
        okText="保存"
        visible={visible}
        mask={false}
        maskClosable={false}
        destroyOnClose={true}
        onOk={() => add(this.props.form)}
        onCancel={handleCancel}
      >
        <Row type="flex" className={styles.add}>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
              label="预案id"
            >
              {form.getFieldDecorator('planInfoID', {
                initialValue: planBasicInfo.planInfoID,
              })(
                <Input placeholder="请输入预案名称" />
              )}
            </FormItem>
          </Col>

          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="预案名称"
            >
              {form.getFieldDecorator('planName', {
                initialValue: planBasicInfo.planName,
              })(
                <Input placeholder="请输入预案名称" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="预案类型"
            >
              {form.getFieldDecorator('planType', {
                initialValue: planBasicInfo.planType,
              })(
                <Select
                  placeholder="请选择预案类型"
                  style={{ width: '100%' }}
                >
                  {
                    preplanType.map(item => (
                      <Option key={item.code} value={item.code} >{item.codeName}</Option>
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
              label="预案等级"
            >
              {form.getFieldDecorator('planLevelID', {
                initialValue: planBasicInfo.planPlanLevel ? `${planBasicInfo.planPlanLevel.emgcLevelID}` : '',
              })(
                <Select
                  placeholder="请选择预案等级"
                  style={{ width: '100%' }}
                >
                  {
                    planLevelList.map(item => (
                      <Option key={`${item.emgcLevelID}`} value={`${item.emgcLevelID}`} >{item.levelName}</Option>
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
              label="预案状态"
            >
              {form.getFieldDecorator('statu', {
                initialValue: `${planBasicInfo.statu}`,
              })(
                <Select
                  placeholder="请选择预案状态"
                  style={{ width: '100%' }}
                >
                  {
                    planStatu.map(item => (
                      <Option value={`${item.key}`} >{item.name}</Option>
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
              label="适用对象"
            >
              {form.getFieldDecorator('applyObjectName', {
                initialValue: '',
                rules: [],
              })(
                <Input placeholder="请输入适用对象" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="预案版本"
            >
              {form.getFieldDecorator('version', {
                initialValue: planBasicInfo.version,
                rules: [],
              })(
                <Input placeholder="请输入预案版本" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="编制部门"
            >
              {form.getFieldDecorator('orgID', {
                initialValue: `${planBasicInfo.orgID}`,
                rules: [],
              })(
                <Select
                  placeholder="请选择编制部门"
                  style={{ width: '100%' }}
                >
                  {
                    publisher.map(item => (
                      <Option key={`${item.orgID}`} value={`${item.orgID}`} >{item.orgnizationName}</Option>
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
              label="注意事项"
            >
              {form.getFieldDecorator('attention', {
                initialValue: planBasicInfo.attention,
                rules: [],
              })(
                <TextArea rows={3} placeholder="请输入注意事项" />
              )}
            </FormItem>
          </Col>
          {/* <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="直接匹配特征"
            >
              {form.getFieldDecorator('featureType4', {
                initialValue: '',
                rules: [
                ],
              })(
                <Input placeholder="请输入直接匹配特征" />
              )}
            </FormItem>
          </Col> */}
          {/* 
          预案编号、
          预案名称、
          预案类别（事件分类管理EC-80-80-01）预案类型、
          预案级别（事件分级管理EC-80-80-02）、
          适用对象（对象名称、对象编号）、
          预案版本、
          编制部门、
          直接匹配特征(事件特征选择EC-80-70-02)、
          注意事项
         */}
        </Row>
      </Modal>
    );
  }
}
