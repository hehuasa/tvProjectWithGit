import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import OrgInfo from './OrgInfo';
import DoorInfo from './DoorInfo';
import FactoryInfo from './FactoryInfo';
import SmoothWeek from './SmoothWeek';
import SmoothDay from './SmoothDay';


const { Option } = Select;
const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
};
const menu = [
  { name: '各部门人员分布情况', value: 1 },
  { name: '人员进出实时情况', value: 2 },
  { name: '人员进出明细信息', value: 3 },
  { name: '今日在场人数', value: 4 },
  { name: '每日入场人数', value: 5 },
];
@connect(({ map, accessControl }) => {
  return {
    mainMap: map.mainMap,
    mapView: map.mapView,
    accessControl,
  };
})
export default class AccessControl extends PureComponent {
  state = {
    type: 2,
  };
  getComponent = (key, accessControl) => {
    const { dispatch } = this.props;
    switch (Number(key)) {
      case 1:
        return <OrgInfo doorOrgCount={accessControl.doorOrgCount} dispatch={dispatch} hasErrors={hasErrors} name={menu[key - 1].name} />;
      case 2:
        return <DoorInfo doorCount={accessControl.doorCount} dispatch={dispatch} hasErrors={hasErrors} name={menu[key - 1].name} />;
      case 3:
        return <FactoryInfo doorCount={accessControl.doorCount} dispatch={dispatch} hasErrors={hasErrors} name={menu[key - 1].name} />;
      case 4:
        return <SmoothWeek countByTime={accessControl.countByTime} dispatch={dispatch} hasErrors={hasErrors} name={menu[key - 1].name} />;
      case 5:
        return <SmoothDay countByDay={accessControl.countByDay} dispatch={dispatch} hasErrors={hasErrors} name={menu[key - 1].name} />;
      default: return null;
    }
  };
  handleSelect=(e) => {
    this.setState({ type: e });
  };
  render() {
    const { accessControl } = this.props;
    return (
      <div>
        <div>
          列表类型：
          <Select defaultValue={2} style={{ width: 200 }} onSelect={this.handleSelect}>
            { menu.map(item =>
              <Option value={item.value} key={item.value}>{item.name}</Option>)}
          </Select>
        </div>
        <div>{this.getComponent(this.state.type, accessControl)}</div>
      </div>
    );
  }
}

