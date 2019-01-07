import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import styles from '../index.less';
import DeviceProduction from './DeviceProduction/index';
import ProductionStatus from './ProductionStatus/index';
import CrackingFurnace from './CrackingFurnace/index';
import ThermoelectricFurnace from './ThermoelectricFurnace/index';
import RawMaterial from './RawMaterial/index';
import Dynamotor from './Dynamotor/index';
import OrganicProduct from './OrganicProduct/index';
import ResinProduct from './ResinProduct/index';
import SolidDefects from './SolidDefects/index';
import PowerConsumption from './PowerConsumption/index';
import RecycledWater from './RecycledWater/index';
import SteamBalance from './SteamBalance/index';
import Wastewater from './Wastewater/index';

const { TabPane } = Tabs;
@connect(({ productionDaily }) => ({
  productionDaily,
}))
class DailyProduction extends PureComponent {
  tabChange = () => {
    // 新的页面清除时间
    this.props.dispatch({
      type: 'productionDaily/saveStartTimes',
      payload: { startTimes: null },
    });
  };
  render() {
    return (
      <Tabs tabPosition="left" onChange={this.tabChange} className={styles.daily}>
        <TabPane tab="各装置生产情况" key="1">
          <DeviceProduction />
        </TabPane>
        <TabPane tab="裂解炉运行状况" key="2">
          <CrackingFurnace />
        </TabPane>
        <TabPane tab="热电锅炉运行状况" key="3">
          <ThermoelectricFurnace />
        </TabPane>
        <TabPane tab="发电机运行状况" key="4">
          <Dynamotor />
        </TabPane>
        <TabPane tab="生产情况" key="5">
          <ProductionStatus />
        </TabPane>
        <TabPane tab="原材料" key="6">
          <RawMaterial />
        </TabPane>
        <TabPane tab="有机产品" key="7">
          <OrganicProduct />
        </TabPane>
        <TabPane tab="树脂产品" key="8">
          <ResinProduct />
        </TabPane>
        {/* <TabPane tab="固体残次品库存" key="9"> */}
        {/* <SolidDefects /> */}
        {/* </TabPane> */}
        <TabPane tab="动力消耗" key="10">
          <PowerConsumption />
        </TabPane>
        <TabPane tab="循环水检测" key="11">
          <RecycledWater />
        </TabPane>
        <TabPane tab="蒸汽平衡表" key="12">
          <SteamBalance />
        </TabPane>
        <TabPane tab="生产污水和氮气平衡表" key="13">
          <Wastewater />
        </TabPane>
      </Tabs>
    );
  }
}
export default connect()(DailyProduction);
