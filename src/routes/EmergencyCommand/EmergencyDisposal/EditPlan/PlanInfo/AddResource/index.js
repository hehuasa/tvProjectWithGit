import React, { PureComponent } from 'react';
import { Row, Col, Modal, Form, Input, Radio, Icon } from 'antd';
import { connect } from 'dva';
import SelectMaterial from './SelectMaterial/index';
import styles from './index.less';
import { commonData } from '../../../../../../../mock/commonData';

const FormItem = Form.Item;
const { TextArea, Search } = Input;
const RadioGroup = Radio.Group;
@connect(({ emergency }) => ({
  emergency,
}))
@Form.create()
export default class AddResource extends PureComponent {
  state = {
    visible: false,
    name: '',
    selectedRow: {},
    resourceType: 1,
  };
  handleSearch = (value) => {
    this.setState({
      visible: true,
      name: value,
    });
    // 改变所选的类型
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { resourceType } = fieldsValue;
      this.setState({
        resourceType,
      });
      // 默认搜索一次资源信息
      if (resourceType === 1) {
        this.props.dispatch({
          type: 'emergency/resourcePage',
          payload: { pageNum: 1,
            pageSize: 5,
            isQuery: true,
            fuzzy: true,
            // resourceName: value,
          },
        });
      } else {
        this.props.dispatch({
          type: 'emergency/resMaterialPage',
          payload: {
            pageNum: 1,
            pageSize: 5,
            isQuery: true,
            fuzzy: true,
            // materialName: value,
          },
        });
      }
    });
  };
  // 关闭物资选择弹窗
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  // 物资选择弹窗 确定函数
  selectRow = (selectedRow) => {
    this.setState({
      visible: false,
      selectedRow,
    });
    if (this.state.resourceType === 1) {
      this.props.form.setFieldsValue({ resourceName: selectedRow.resourceName });
    } else {
      this.props.form.setFieldsValue({ resourceName: selectedRow.materialName });
    }
  };
  radioChange = (e) => {
    e.preventDefault();
    this.setState({
      resourceType: e.target.value,
    });
  };
  render() {
    const { add, handleCancel, visible, form, isAdd } = this.props;
    const { resourceInfo } = this.props;
    return (
      <Modal
        title={isAdd ? '新增应急资源' : '修改应急资源'}
        cancelText="取消"
        okText="保存"
        visible={visible}
        mask={false}
        maskClosable={false}
        destroyOnClose
        onOk={() => add(this.props.form)}
        onCancel={handleCancel}
      >
        {form.getFieldDecorator('execPlanResourceID', {
          initialValue: isAdd ? null : (resourceInfo.execPlanResourceID),
        })(<Input type="hidden" />)}
        {form.getFieldDecorator('eventExecPlanID', {
          initialValue: resourceInfo.eventExecPlanID,
        })(<Input type="hidden" />)}
        {form.getFieldDecorator('toolMaterialInfoID', {
          initialValue: resourceInfo.toolMaterialInfoID,
        })(<Input type="hidden" />)}
        <Row type="flex" className={styles.add}>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="资源类型"
            >
              {form.getFieldDecorator('resourceType', {
                initialValue: resourceInfo.resResourceInfo ? 1 : 2,
              })(
                <RadioGroup>
                  <Radio value={1}>资源</Radio>
                  <Radio value={2}>物资</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            {form.getFieldDecorator('toolMaterialInfoID', {
              initialValue: this.state.selectedRow.toolMaterialInfoID,
            })(<Input type="hidden" />)}
            {form.getFieldDecorator('resourceID', {
              initialValue: this.state.selectedRow.resourceID,
            })(<Input type="hidden" />)}
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="资源名称"
            >
              {form.getFieldDecorator('resourceName', {
                initialValue: isAdd ? '' : (resourceInfo.resResourceInfo ?
                  resourceInfo.resResourceInfo.resourceName :
                  (resourceInfo.resToolMaterialInfo ? resourceInfo.resToolMaterialInfo.materialName : '')),
              })(
                <Input disabled addonAfter={<Icon type="search" onClick={() => this.handleSearch()} />} />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="数量"
            >
              {form.getFieldDecorator('useCount', {
                initialValue: isAdd ? '' : resourceInfo.useCount,
                rules: [
                  { pattern: /^[0-9]*$/, message: '只能为数字' },
                ],
              })(
                <Input placeholder="请输入数量" />
              )}
            </FormItem>
          </Col>
        </Row>
        <SelectMaterial
          name={this.state.name}
          visible={this.state.visible}
          add={this.selectRow}
          handleCancel={this.handleCancel}
          resourceType={this.state.resourceType}
        />
      </Modal>
    );
  }
}
