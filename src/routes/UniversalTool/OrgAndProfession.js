import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Tabs, Radio, Divider } from 'antd';

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

@connect(({ template }) => ({
  template,
}))
@Form.create()
export default class OrgAndProfession extends PureComponent {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="按部门" key="1">
            <RadioGroup defaultValue={1}>
              <Radio value={1}>全部门</Radio>
              <Radio value={2}>本部门</Radio>
              <Radio value={3}>指定部门</Radio>
            </RadioGroup>
          </TabPane>
          <TabPane tab="按专业系统" key="2">
            <RadioGroup defaultValue={1}>
              <Radio value={1}>全专业系统</Radio>
              <Radio value={2}>指定专业系统</Radio>
            </RadioGroup>
          </TabPane>
        </Tabs>
        <Divider>报警类型</Divider>
        <RadioGroup defaultValue={1}>
          <Radio value={1}>全类型</Radio>
          <Radio value={2}>指定类型</Radio>
        </RadioGroup>
      </div>
    );
  }
}
