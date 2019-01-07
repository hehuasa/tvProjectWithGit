import React, { PureComponent } from 'react';
import { Collapse, Icon } from 'antd';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import { Bar } from '../../components/Charts';
import ProductTable from './ProductTable';
import styles from './sideBar.less';
import up from '../../assets/envi/carousel-up.png';
import down from '../../assets/envi/carousel-down.png';

// 表单假数据行（首页右侧）
const tableData = { name: '裂解',
  data: [{
    key: '1',
    colSpan: 4,
    type: '投入',
    materiel: '加氢尾油',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '2',
    type: '投入',
    materiel: '饱和液化气',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '3',
    type: '投入',
    materiel: '加氢尾油',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '4',
    type: '投入',
    materiel: '饱和液化气',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '5',
    type: '产出',
    materiel: '加氢尾油',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '6',
    type: '产出',
    materiel: '加氢尾油',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '7',
    type: '产出',
    materiel: '加氢尾油',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '8',
    type: '产出',
    materiel: '加氢尾油',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  },
  ] };
// 饼图假数据（首页右侧）
const barData = { name: '污水总排口',
  data: [
    {
      x: 'COD',
      y: 6,
    },
    {
      x: '氮氧',
      y: 12,
    },
    {
      x: 'PH',
      y: 16,
    },
    {
      x: '油',
      y: 19,
    }] };


const { Panel } = Collapse;
@connect(({ sidebar }) => ({
  sidebar,
}))

class HeaderPanel extends PureComponent {
  handleClick=(e) => {
    e.stopPropagation();
    switch (Number(e.target.dataset.type)) {
      case 1:
        this.props.dispatch({
          type: 'sidebar/zoomIn',
          payload: {
            id: this.props.id,
            data: {
              data: this.props.data.data,
              title: this.props.data.name,
            } },
        });
        break;
      case 2:
        break;
      case 3:
        break;
      default: break;
    }
  };
  // 折叠标签的header
  render() {
    return (
      <div className={styles.headerStyle}>
        {this.props.isCollapse ? <span className={styles.icon}><img src={down} /></span> : <span className={styles.icon}><img src={up} /></span> }
        <span>{this.props.title}</span>
        <Icon type="arrows-alt" className={styles['zoom-in']} data-type={1} onClick={this.handleClick} />
        <Icon type="bars" className={styles['zoom-in']} data-type={2} onClick={this.handleClick} />
        <Icon type="pie-chart" className={styles['zoom-in']} data-type={3} onClick={this.handleClick} />
      </div>
    );
  }
}

// @connect(({ sidebar }) => ({
//   sidebar,
// }))
// class DataHeading extends PureComponent {
//   handleClick=(e) => {
//     e.stopPropagation();
//     const allFold = !this.props.allFold;
//     this.props.dispatch({
//       type: 'sidebar/fakeMonitorSideData',
//       payload: { activeKeys: allFold === false ? ['1', '2', '3', '4'] : [], allFold },
//     });
//   };
//   render() {
//     return (
//       <div className={styles['side-header']} onClick={this.handleClick}>
//         <span>数据展示</span>
//         {this.props.allFold === false ? <Icon type="up" className={styles['data-heading']} /> : <Icon type="down" className={styles['data-heading']} />}
//       </div>
//     );
//   }
// }

const mapStateToProps = ({ sidebar }) => {
  return {
    activeKeys: sidebar.activeKeys,
  };
};
@connect(({ sidebar }) => ({
  sidebar,
}))
class Sidebar extends PureComponent {
  constructor() {
    super();
    this.state = {
      activeKey: ['1'],
      allFold: false,
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'sidebar/fakeMonitorSideData',
    });
  }
  handChange=(activeKey) => {
    this.props.dispatch({
      type: 'sidebar/getIfAllFold',
      payload: {
        activeKeys: activeKey,
      },
    });
  };
  handleClick=(e) => {
    e.stopPropagation();
    this.setState({ allFold: !this.state.allFold });
    this.props.dispatch({
      type: 'sidebar/getIfAllFold',
      payload: {
        activeKeys: this.state.allFold ? [] : ['1', '2', '3', '4'],
      },
    });
  };
  render() {
    const { data, activeKeys } = this.props.sidebar;
    return (
      <Scrollbars>
        <div className={styles['side-header']} onClick={this.handleClick}>
          <span>数据展示</span>
          {this.state.allFold === false ? <Icon type="up" className={styles['data-heading']} /> : <Icon type="down" className={styles['data-heading']} />}
        </div>
        <Collapse
          bordered={false}
          defaultActiveKey={['1']}
          activeKey={activeKeys}
          onChange={this.handChange}
        >
          <Panel header={<HeaderPanel title={data.barData.name} id="1" data={data.barData} isCollapse={activeKeys.indexOf('1') !== -1} />} key="1" showArrow={true}>
            <div style={{ padding: '5px 5px 0 30px' }}>
              <Bar height={260} data={data.barData.data} />
            </div>
          </Panel>
          <Panel header={<HeaderPanel title={data.tableData.name} id="2" data={data.tableData} isCollapse={activeKeys.indexOf('2') !== -1} />} key="2" showArrow={true}>
            <ProductTable data={data.tableData.data} />
          </Panel>
          <Panel header={<HeaderPanel title={data.barData.name} data={data.barData} id="3" isCollapse={activeKeys.indexOf('3') !== -1} />} key="3" showArrow={true}>
            <Bar height={260} data={data.barData.data} />
          </Panel>
          <Panel header={<HeaderPanel title={data.tableData.name} id="4" data={data.tableData} isCollapse={activeKeys.indexOf('4') !== -1} />} key="4" showArrow={true}>
            <ProductTable data={data.tableData.data} />
          </Panel>
        </Collapse>
      </Scrollbars>
    );
  }
}
export default connect(mapStateToProps)(Sidebar);
