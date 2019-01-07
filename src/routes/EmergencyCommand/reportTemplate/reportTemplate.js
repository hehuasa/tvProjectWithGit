import React, { PureComponent } from 'react';
import { Form, Button, Row, Col, Input, Modal, Table, Select, message, Icon, } from 'antd';
import styles from './reportTemplate.less';
const FormItem = Form.Item;
const Option = Select.Option;
const data = [
  { name: '事件1', entEmgcRFID: 1 },
  { name: '事件2', entEmgcRFID: 2 },
  { name: '事件3', entEmgcRFID: 3 },
  { name: '事件4', entEmgcRFID: 4 },
]

@Form.create()
export default class ReportTemplate extends PureComponent {

  //选择类型
  onHandleChange = (value) => {
    console.log(`selected ${value}`);
  }
  // del
  onDelFeature = (id) => {
    console.log(id)
    // this.props.dispatch({
    //   type: 'emergency/delEventFeatures',
    //   payload: {
    //     id: id.target.dataset.type,
    //     eventID: this.props.emergency.eventId,
    //   },
    // }).then(() => {
    //   message.success('删除成功');
    // })
  }
  //add
  onAddEvent = (id) => {
    // this.props.dispatch({
    //   type: 'emergency/delEventFeatures',
    //   payload: {
    //     id: id.target.dataset.type,
    //     eventID: this.props.emergency.eventId,
    //   },
    // }).then(() => {
    //   message.success('删除成功');
    // })
  }

  render() {
    const { form } = this.props;
    return (
      <div>
        <Row type="flex" >
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="类型"
            >
              {form.getFieldDecorator('qq类型', {
                initialValue: '',
              })(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择类型"
                  optionFilterProp="children"
                  onChange={this.onHandleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="jack">火灾报警</Option>
                  <Option value="lucy">气体报警</Option>
                  <Option value="tom">硫化氢报警</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row >

        <Row type="flex" >
          <Col md={12} sm={24}>
            <label>事件名称：</label>
            <Input disabled placeholder="请输入事件名称" />
          </Col>
          <Col md={12} sm={24}>
            <label>事发部门：</label>
            <Input disabled placeholder="请选择事发部门" />
          </Col>
          <Col md={12} sm={24}>
            <label>监测器具：</label>
            <Input disabled placeholder="请输入监测器具" />
          </Col>
          <Col md={12} sm={24}>
            <label>事发设备：</label>
            <Input disabled placeholder="请输入事发设备" />
          </Col>
          <Col md={12} sm={24}>
            <label>事发位置：</label>
            <Input disabled placeholder="请输入事发位置" />
          </Col>
          <Col md={12} sm={24}>
            <label>事件物质：</label>
            <Input disabled placeholder="请输入事件物质" />
          </Col>
          <Col md={12} sm={24}>
            <label>事发原因：</label>
            <Input disabled placeholder="请输入事发原因" />
          </Col>
          <Col md={12} sm={24}>
            <label>报警现状：</label>
            <Input disabled placeholder="请输入报警现状" />
          </Col>
          <Col md={12} sm={24}>
            <label>报警人：</label>
            <Input disabled placeholder="请输入报警人" />
          </Col>
          <Col md={12} sm={24}>
            <label>联系电话：</label>
            <Input disabled placeholder="请输入联系电话" />
          </Col>
          <Col md={12} sm={24}>
            <label>事发部位：</label>
            <Input disabled placeholder="请输入事发部位" />
          </Col>
          <Col md={12} sm={24}>
            <label>警情摘要：</label>
            <Input disabled placeholder="请输入警情摘要" />
          </Col>
          <Col md={12} sm={24}>
            <label>已采取措施：</label>
            <Input disabled placeholder="请输入已采取措施" />
          </Col>
          <Col md={12} sm={24}>
            <label>处警说明：</label>
            <Input disabled placeholder="请输入处警说明" />
          </Col>
        </Row>


        <div className={styles.alarmDeal}>
          <Row type="flex" >
            {
              data.map(item =>
                (
                  <Col key={item.entEmgcRFID} md={12} sm={24}>
                    <label>{item.name}</label>
                    <Input
                      disabled
                      addonAfter={
                        <Icon type="close"
                          className={styles.cursor}
                          onClick={this.onDelFeature}
                          data-type={item.entEmgcRFID}
                        />
                      } placeholder="请输入事件名称" />
                  </Col>
                )
              )
            }
          </Row >
        </div>
        <div className={styles.onAddEvent}>
          <Button onClick={this.onAddEvent} type="primary">添加</Button>
        </div>

      </div>
    )
  }
};
