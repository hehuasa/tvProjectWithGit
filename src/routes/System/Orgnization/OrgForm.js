import React, { PureComponent } from 'react';
import { Tree, Form, Input, Row, Col, Button, Icon, Select, Radio } from 'antd';
import { connect } from 'dva';
import styles from './Organization.less';

const FormItem = Form.Item;
const { Option } = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@Form.create()
export default class OrgForm extends PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { orgTypeList } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <FormItem>
          {getFieldDecorator('orgID')(
            <Input type="hidden" placeholder="请输入" />
          )}
        </FormItem>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={20} offset={2}>
            <FormItem label="机构编码">
              {getFieldDecorator('orgnizationCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={20} >
            <FormItem label="上级机构">
              {getFieldDecorator('parentOrgnization')(
                <Input disabled placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={20} offset={2}>
            <FormItem label="机构名称">
              {getFieldDecorator('orgnizationName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={20}>
            <FormItem label="名称拼音">
              {getFieldDecorator('queryKey')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={20} offset={2}>
            <FormItem label="机构简称">
              {getFieldDecorator('shortName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={20}>
            <FormItem label="机构类型">
              {getFieldDecorator('orginaztionType')(
                <Select placeholder="请选择">
                  <Option value="">请选择</Option>
                  {orgTypeList.map(type =>
                    <Option key={type.codeID} value={type.code}>{type.codeName}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={20} offset={2}>
            <FormItem label="是否有效">
              {getFieldDecorator('enabled')(
                <RadioGroup name="enabled">
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={20}>
            <FormItem label="排序序号">
              {getFieldDecorator('sortIndex')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={20} offset={2}>
            <FormItem label="机构地址">
              {getFieldDecorator('address')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={20}>
            <FormItem label="机构介绍">
              {getFieldDecorator('remark')(
                <TextArea placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={20} offset={2}>
            <FormItem label="外部编码">
              {getFieldDecorator('otherCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={20}>
            <FormItem label="机构级别">
              {getFieldDecorator('orgnizationLevel')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={20} offset={2}>
            <FormItem label="是否虚拟">
              {getFieldDecorator('virtual')(
                <RadioGroup name="virtual">
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} align="bottom">
          <Col sm={6} offset={9}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
}
