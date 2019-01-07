import React, { PureComponent } from 'react';
import { Tabs, Button } from 'antd';
import { connect } from 'dva';
import Table1 from './Table1';
import Table2 from './Table2-bak';
import styles from './index.less';

const { TabPane } = Tabs;
const operations = <Button type="primary" style={{ marginRight: 120 }} icon="download" >导出</Button>;
@connect(({ productionDaily }) => {
  return {
    list: productionDaily.list,
  };
})
export default class DailyProductionList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'productionDaily/fetchList',
      payload: '',
    });
  }
  render() {
    return (
      <Tabs
        tabBarExtraContent={operations}
        className={styles.listWarp}
        ref={(ref) => { this.tabs = ref; }}
      >
        <TabPane tab="生产日报一" key="1">
          <Table1 data={this.props.list} />
        </TabPane>
        <TabPane tab="生产日报二" key="2">
          <Table2 data={this.props.list} />
        </TabPane>
      </Tabs>
    );
  }
}
