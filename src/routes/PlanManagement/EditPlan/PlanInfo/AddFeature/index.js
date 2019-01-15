import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Form, Input, Select, Radio } from 'antd';
// import styles from './index.less';
import { commonData } from '../../../../../../mock/commonData';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;

const addKey = (featurePlan) => {
  const newFeaturePlan = [];
  featurePlan.map((item) => {
    item.key = item.featureID;
    newFeaturePlan.push({ planFeatureInfo: item });
  });
  return newFeaturePlan;
};
// const mapStateToProps = (state) => {
//   console.log(16, state)
//   return {
//     featurePlan: addKey(state.featurePlan),
//   };
// }
@connect(({ planManagement }) => ({
  featurePlan: addKey(planManagement.featurePlan),
  eventFeaturePlan: planManagement.eventFeaturePlan,
  eventType: planManagement.eventType,
  featureType: planManagement.featureType,
  dataType: planManagement.dataType,
}))
@Form.create()
export default class AddFeature extends PureComponent {
  componentWillUnmount() {
    this.props.dispatch({
      type: 'planManagement/saveEventFeaturePlan',
      payload: {},
    });
    this.props.dispatch({
      type: 'planManagement/saveDataType',
      payload: '102.101',
    });
  }
  state = {
    feature: undefined, // 保存自动的输入的数据
    idDisabled: true, // 是否可输入 true-不能输入
  }
  setInputText = (item) => {
    const { form } = this.props;
    if (!this.state.idDisabled) {
      this.setState({
        idDisabled: true,
      });
    }
    form.setFieldsValue({
      featureCode: item.featureCode,
      dataType: item.dataType,
      featureUnit: item.featureUnit,
      featureDes: item.featureDes,
      featureType: item.featureType,
    });
  }
  // 判断是手动输入特征还是自动
  onHandleChange = (text, row) => {
    this.setState({
      feature: row,
    });
    this.dataTypeChange(row.dataType);
    if (row.props.title) {
      const { featurePlan } = this.props;
      for (const item of featurePlan) {
        if (typeof item.planFeatureInfo.featureID === 'string') {
          if (item.planFeatureInfo.featureID === row.props.title) {
            this.setInputText(item.planFeatureInfo);
            return;
          }
        } else if (`${item.planFeatureInfo.featureID}` === row.props.title) {
          this.setInputText(item.planFeatureInfo);
          return;
        }
      }
    } else if (this.state.idDisabled) {
      const { form } = this.props;
      this.setState({
        idDisabled: false,
      });
      form.setFieldsValue({
        featureCode: '',
        featureType: '',
        featureUnit: '',
        featureDes: '',
      });
    }
  };
  dataTypeChange = (value) => {
    this.props.form.setFieldsValue({ dataType: value });
    this.props.dispatch({
      type: 'planManagement/saveDataType',
      payload: value,
    });
  };
  // 不同数据类型 不同特征规则 获取不同正则验证
  getPattern = () => {
    // dataType: 字符102.101 数字102.102 布尔102.104
    // featureExpresstion: > < = >= <= in
    const { dataType, featureExpresstion } = this.props.form.getFieldsValue(['dataType', 'featureExpresstion']);
    switch (dataType) {
      case '102.101':
        return featureExpresstion === 'in' ? /^[^,]+(?:,[^,]+)*$/ : null;
      case '102.102':
        return featureExpresstion === 'in' ? /^\d+(,\d+)$/ : /^[0-9]*$/;
      default: break;
    }
  };
  getMessage = () => {
    // dataType: 字符102.101 数字102.102 布尔102.104
    // featureExpresstion: > < = >= <= in
    const { dataType, featureExpresstion } = this.props.form.getFieldsValue(['dataType', 'featureExpresstion']);
    switch (dataType) {
      case '102.101':
        return featureExpresstion === 'in' ? '请输入正确格式,eg: 值1,值2,值3...' : null;
      case '102.102':
        return featureExpresstion === 'in' ? '请输入正确格式,eg: 0,100' : '只能输入数字';
      default:
        return '请输入特征值';
    }
  };

  render() {
    const { add, handleCancel, visible, form, isAdd,
      featurePlan, dataType, eventFeaturePlan, featureType } = this.props;
    const { planFeatureInfo = {} } = eventFeaturePlan;
    const { idDisabled } = this.state;
    return (
      <Modal
        title={isAdd ? '新增事件特征' : '修改事件特征'}
        cancelText="取消"
        okText="保存"
        visible={visible}
        mask={false}
        maskClosable={false}
        destroyOnClose
        onOk={() => add({ form: this.props.form, feature: this.state.feature })}
        onCancel={handleCancel}
      >
        <Row type="flex" >
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="特征名称"
            >
              {form.getFieldDecorator('featureID', {
                initialValue: !isAdd ? (planFeatureInfo ? planFeatureInfo.featureName : null) : null,
                rules: [
                  { required: true, message: '特征编号不能为空' },
                ],
              })(
                <Select
                  placeholder="请输入特征或选择特征"
                  mode="combobox"
                  onChange={this.onHandleChange}
                  style={{ width: '100%' }}
                >
                  {
                    featurePlan.map((item, index) => (
                      <Option title={`${item.planFeatureInfo.featureID}`} key={`${item.planFeatureInfo.featureID}`} value={item.planFeatureInfo.featureName} >{item.planFeatureInfo.featureName}</Option>
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
              label="是否直接特征"
            >
              {form.getFieldDecorator('drectFeature', {
                initialValue: !isAdd ? eventFeaturePlan.drectFeature || 0 : 0,
              })(
                <Select style={{ width: '100%' }} >
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="数据类型"
            >
              {form.getFieldDecorator('dataType', {
                initialValue: !isAdd ? (planFeatureInfo ? planFeatureInfo.dataType : null) : null,
                rules: [
                  { required: true, message: '数据类型必填' },
                ],
              })(
                <Select placeholder="请选择数据类型" style={{ width: '100%' }} onChange={this.dataTypeChange}>
                  <Option value="102.101">字符型</Option>
                  <Option value="102.102">数字型</Option>
                  <Option value="102.104">布尔型</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {(dataType === '102.104' || planFeatureInfo.dataType === '102.104') ? null : (
            <Col md={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="特征规则"
              >
                {form.getFieldDecorator('featureExpresstion', {
                initialValue: !isAdd ? eventFeaturePlan.featureExpresstion : null,
                rules: [
                  { required: true, message: '规则必填' },
                ],
              })(
                <Select placeholder="请选择规则" style={{ width: '100%' }} >
                  {
                    commonData.featureRuleList.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)
                  }
                </Select>
              )}
              </FormItem>
            </Col>) }
          <Col md={24}>
            {(this.props.dataType === '102.104' || planFeatureInfo.dataType === '102.104') ? (
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="特征值"
              >
                {form.getFieldDecorator('featureValue', {
                initialValue: !isAdd ? !!eventFeaturePlan.featureValue : true,
              })(
                <RadioGroup>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </RadioGroup>
              )}
              </FormItem>
            ) : (
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="特征值"
              >
                {form.getFieldDecorator('featureValue', {
                            initialValue: !isAdd ? eventFeaturePlan.featureValue : null,
                            rules: [
                              // { pattern: this.props.dataType === '102.102' ? /^[0-9]*$/ : '', message: this.props.dataType === '102.102' ? '只能输入数字' : '' },
                              { pattern: this.getPattern(), message: this.getMessage() },
                            ],
                          })(
                            <Input placeholder={this.getMessage()} />
                          )}
              </FormItem>
            )}
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="权重"
            >
              {form.getFieldDecorator('weight', {
                initialValue: !isAdd ? eventFeaturePlan.weight : null,
                rules: [
                  { pattern: /^[0-1]$|^0\.[0-9]+$/, message: '只能输入0到1数字' },
                ],
              })(
                <Input placeholder="请输入权重" />
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
                initialValue: !isAdd ? (planFeatureInfo ? planFeatureInfo.featureType : null) : null,
                rules: [
                ],
              })(
                <Select
                  placeholder="请选择特征类型"
                  style={{ width: '100%' }}
                  disabled={idDisabled}
                >
                  {
                    featureType.map(item => (
                      <Option key={`${item.codeID}`} value={`${item.code}`} >{item.codeName}</Option>
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
              label="计量单位"
            >
              {form.getFieldDecorator('featureUnit', {
                initialValue: !isAdd ? (planFeatureInfo ? planFeatureInfo.featureUnit : null) : null,
                rules: [],
              })(
                <Input disabled={idDisabled} placeholder="请输入计量单位" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="特征描述"
            >
              {form.getFieldDecorator('featureDes', {
                initialValue: !isAdd ? (planFeatureInfo ? planFeatureInfo.featureDes : null) : null,
                rules: [],
              })(
                <TextArea placeholder="请输入特征描述" disabled={idDisabled} rows={4} />
              )}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

// export default connect(mapStateToProps)(AddFeature);
