import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import ArcgisMap from '../ArcgisMap/ArcgisMap';
import TriggerRight from '../HomePage/Collapsed/TriggerRight';
import Sidebar from '../HomePage/SideBar/Sidebar';
import styles from '../HomePage/SideBar/sideBar.less';


const { Sider, Content, Footer } = Layout;
@connect(({ global }) => {
  return {
    rightCollapsed: global.rightCollapsed,
  };
})
export default class Evr extends PureComponent {
  render() {
    return (
      <Layout>
        <Layout>
          <Content>
            <ArcgisMap />
            <Footer style={{ padding: 0 }}><MonitorVideo /></Footer>
          </Content>
          <div style={{ position: 'relative' }}>
            <div className={styles['panel-zoom-in']}>
            </div>
          </div>
          <Sider className={styles['side-right']} width={440} collapsible collapsed={this.props.rightCollapsed} collapsedWidth={0}><TriggerRight /><Sidebar /></Sider>
        </Layout>
      </Layout>
    );
  }
}
