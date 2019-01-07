import React, { PureComponent } from 'react';
import { Collapse, Icon } from 'antd';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import { Bar } from '../../../components/Charts/index';
import ProductTable from './ProductTable';
import WarningtTable from './WarningtTable';
import WarningtLine from './WarningtLine';
import WarningtHistogram from './WarningtHistogram';
import styles from './sideBar.less';
import up from '../../../assets/envi/carousel-up.png';
import down from '../../../assets/envi/carousel-down.png';

const { Panel } = Collapse;
class HeaderPanelData extends PureComponent {
  handleClick = (e) => {
    e.stopPropagation();
    switch (Number(e.target.dataset.type)) {
      case 1:
        this.props.dispatch({
          type: 'sidebar/zoomIn',
          payload: {
            id: this.props.id,
            data: {
              // data: this.props.data.data,
              // title: this.props.data.name,
            }
          },
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
        {this.props.isCollapse ? <span className={styles.icon}><img src={down} /></span> : <span className={styles.icon}><img src={up} /></span>}
        <span>{this.props.title}</span>
        <Icon type="arrows-alt" className={styles['zoom-in']} data-type={1} onClick={this.handleClick} />
        <Icon type="bars" className={styles['zoom-in']} data-type={2} onClick={this.handleClick} />
        <Icon type="pie-chart" className={styles['zoom-in']} data-type={3} onClick={this.handleClick} />
      </div>
    );
  }
}
const HeaderPanel = connect()(HeaderPanelData);

const mapStateToProps = ({ sidebar, user }) => {
  return {
    sidebar, user
  };
};

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
  handChange = (activeKey) => {
    this.props.dispatch({
      type: 'sidebar/getIfAllFold',
      payload: {
        activeKeys: activeKey,
      },
    });
  };
  handleClick = (e) => {
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
    const { data, activeKeys, visiblePanel, boardList } = this.props.sidebar;
    console.log(boardList.list.map((item, index) => {
      if (item === 6) {
        return true;
      }
      if (index === boardList.list.length - 1) {
        return false;
      }
    }))
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
          {/* {visiblePanel1.indexOf('1') === -1 ? null : (
          <Panel header={<HeaderPanel title={data.barData.name} id="1" data={data.barData} isCollapse={activeKeys.indexOf('1') !== -1} />} key="1" showArrow={false}>
            <div style={{ padding: '5px 5px 0 30px' }}>
              <Bar height={260} data={data.barData.data} />
            </div>
          </Panel>
        )}
          {visiblePanel2.indexOf('2') === -1 ? null : (
            <Panel header={<HeaderPanel title={data.tableData.name} id="2" data={data.tableData} isCollapse={activeKeys.indexOf('2') !== -1} />} key="2" showArrow={false}>
              <ProductTable data={data.tableData.data} />
            </Panel>
          )}
          {visiblePanel3.indexOf('3') === -1 ? null : (
            <Panel header={<HeaderPanel title={data.barData.name} data={data.barData} id="3" isCollapse={activeKeys.indexOf('3') !== -1} />} key="3" showArrow={false}>
              <Bar height={260} data={data.barData.data} />
            </Panel>
          )}
          {visiblePanel4.indexOf('4') === -1 ? null : (
            <Panel header={<HeaderPanel title={data.tableData.name} id="4" data={data.tableData} isCollapse={activeKeys.indexOf('4') !== -1} />} key="4" showArrow={false}>
              <ProductTable data={data.tableData.data} />
            </Panel>
          )} */}
          {boardList.open && boardList.list.map((item, index) => {
            if (item === 5) {
              return true;
            }
            if (index === boardList.list.length - 1) {
              return false;
            }
          }) ? (
              <Panel header={<HeaderPanel title="报警看板" id="5" isCollapse={activeKeys.indexOf('5') !== -1} />} key="5" showArrow={false}>
                <WarningtTable />
              </Panel>
            ) : null}

          {boardList.open && boardList.list.map((item, index) => {
            if (item === 6) {
              return true;
            }
            if (index === boardList.list.length - 1) {
              console.log(2, item, index)
              return false;
            }
          }) ? (
              <Panel header={<HeaderPanel title={'报警折线图'} id="6" isCollapse={activeKeys.indexOf('6') !== -1} />} key="6" showArrow={false}>
                <WarningtLine />
              </Panel>
            ) : null}

          {boardList.open && boardList.list.map((item, index) => {
            if (item === 7) {
              return true;
            }
            if (index === boardList.list.length - 1) {
              console.log(3, item, index)
              return false;
            }
          }) ? (
              <Panel header={<HeaderPanel title={'报警柱状图'} id="7" isCollapse={activeKeys.indexOf('7') !== -1} />} key="7" showArrow={false}>
                <WarningtHistogram />
              </Panel>
            ) : null}

        </Collapse>
      </Scrollbars>
    );
  }
}
export default connect(mapStateToProps)(Sidebar);
