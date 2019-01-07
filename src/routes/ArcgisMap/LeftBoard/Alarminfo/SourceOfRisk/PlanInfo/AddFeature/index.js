import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Form, Input, Select } from 'antd';
// import styles from './index.less';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

const addKey = (featurePlan) => {
  const newFeaturePlan = [];
  featurePlan.map(item => {
    item.key = item.featureID;
    newFeaturePlan.push({ planFeatureInfo: item })
  })
  return newFeaturePlan;
}
// const mapStateToProps = (state) => {
//   console.log(16, state)
//   return {
//     featurePlan: addKey(state.featurePlan),
//   };
// }
@connect(({ planManagement, }) => ({
  featurePlan: addKey(planManagement.featurePlan),
  eventFeaturePlan: planManagement.eventFeaturePlan,
  eventType: planManagement.eventType,
  featureType: planManagement.featureType,
}))
@Form.create()
export default class AddFeature extends PureComponent {
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
      featureType: item.dataType,
      featureUnit: item.featureUnit,
      featureDes: item.featureDes,
      dataType: item.featureType,
    });
  }
  // 判断是手动输入特征还是自动
  onHandleChange = (text, row) => {
    this.setState({
      feature: row,
    })
    if (row.props.title) {
      const { featurePlan } = this.props;
      for (const item of featurePlan) {
        if (typeof item.planFeatureInfo.featureID === "string") {
          if (item.planFeatureInfo.featureID === row.props.title) {
            this.setInputText(item.planFeatureInfo);
            return;
          }
        } else {
          if (`${item.planFeatureInfo.featureID}` === row.props.title) {
            this.setInputText(item.planFeatureInfo);
            return;
          }
        };
      }
    } else {
      if (this.state.idDisabled) {
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
    }
  }

  render() {
    const { add, handleCancel, visible, form, isAdd,
      featurePlan, eventType, eventFeaturePlan, featureType } = this.props;
    const { idDisabled } = this.state;
    return (
      <Modal
        title={isAdd ? '新增事件特征' : '修改事件特征'}
        cancelText="取消"
        okText="保存"
        visible={visible}
        mask={false}
        maskClosable={false}
        destroyOnClose={true}
        onOk={() => add({ form: this.props.form, feature: this.state.feature })}
        onCancel={handleCancel}
      >
        <Row type="flex" >
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="特征"
            >
              {form.getFieldDecorator('featureID', {
                initialValue: eventFeaturePlan.planFeatureInfo ? eventFeaturePlan.planFeatureInfo.featureName : null,
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
                initialValue: eventFeaturePlan.drectFeature || 0,
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
              label="规则"
            >
              {form.getFieldDecorator('featureExpresstion', {
                initialValue: eventFeaturePlan.featureExpresstion,
              })(
                <Input placeholder="请输入特征编号" />
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
                initialValue: eventFeaturePlan.featureValue,
              })(
                <Input placeholder="请输入特征值" />
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
                initialValue: eventFeaturePlan.weight,
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
              label="特征编号"
              disabled={idDisabled}
            >
              {form.getFieldDecorator('featureCode', {
                initialValue: eventFeaturePlan.planFeatureInfo ? eventFeaturePlan.planFeatureInfo.featureCode : null,
                rules: [
                  // { required: true, message: '特征编号不能为空' },
                  { pattern: /^[A-Za-z0-9_]+$/, message: '只能由英文、数字、下划线组成' },
                ],
              })(
                <Input disabled={idDisabled} placeholder="请输入特征编号" />
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
                initialValue: eventFeaturePlan.planFeatureInfo ? eventFeaturePlan.planFeatureInfo.featureType : null,
                rules: [
                ],
              })(
                <Select
                  placeholder="请选择事件类型"
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
              label="事件类型"
            >
              {form.getFieldDecorator('dataType', {
                initialValue: eventFeaturePlan.planFeatureInfo ? eventFeaturePlan.planFeatureInfo.dataType : null,
                rules: [],
              })(
                <Select
                  placeholder="请选择事件类型"
                  style={{ width: '100%' }}
                  disabled={idDisabled}
                >
                  {
                    eventType.map(item => (
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
              label="单位"
            >
              {form.getFieldDecorator('featureUnit', {
                initialValue: eventFeaturePlan.planFeatureInfo ? eventFeaturePlan.planFeatureInfo.featureUnit : null,
                rules: [],
              })(
                <Input disabled={idDisabled} placeholder="请输入单位" />
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
                initialValue: eventFeaturePlan.planFeatureInfo ? eventFeaturePlan.planFeatureInfo.featureDes : null,
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
