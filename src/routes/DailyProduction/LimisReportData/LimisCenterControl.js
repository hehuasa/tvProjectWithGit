import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Scrollbars from 'react-custom-scrollbars';
import moment from 'moment';
import { Table, DatePicker } from 'antd';
import Trend from '../chart/Trend';
import { fakeData } from '../List/lib/data.js';
import styles from '../index.less';

@connect(({ productionDaily, homepage }) => ({
  limisCenterControl: productionDaily.limisCenterControl,
  timeUsePre: productionDaily.timeUsePre,
  videoFooterHeight: homepage.videoFooterHeight,
}))
export default class EquipmentProductInfo extends PureComponent {
  state = {
    showChart: false,
    sortIndex: '',
    chartName: '',
    dateTimes: null,
  };
  componentDidMount() {
    const yesterday = moment().subtract(1, 'days').valueOf();
    this.props.dispatch({
      type: 'productionDaily/getLimisCenterControl',
      payload: { sampleType: '中控', sampledDate: yesterday },
    });
  }
  // 按时间获取装置信息
  onChange = (date) => {
    const startDate = date.valueOf();
    this.props.dispatch({
      type: 'productionDaily/getLimisCenterControl',
      payload: { sampleType: '中控', sampledDate: startDate },
    });
  };
  // 获取制表时间
  getStartTime = (dataArr) => {
    if (dataArr && dataArr.length > 0) {
      this.setState({ dateTimes: dataArr[0].startDate });
    }
  };
  // 点击行
  rawClick = (record) => {
    this.setState({
      showChart: !this.state.showChart,
      sortIndex: record.sortIndex,
      chartName: record.rawName,
      dateTimes: record.startDate,
    });
  };
  // 获取指标值
  getMplDesc = (record) => {
    const { limisCenterControl } = this.props;
    if(limisCenterControl.length < 1) return; //central lutetiumExport products
    const { lutetiumExport } = limisCenterControl[0];
    const arr = lutetiumExport.filter(item =>
      record.locationSearchValue.findIndex(value => value === item.location) !== -1
    && record.sampleSearchValue.findIndex(value => value === item.sampleName) !== -1
    && record.nameSearchValue.findIndex(value => value === item.nameContent) !== -1);
    const { length } = arr;
    if (length > 0) {
      return arr[0].mplDesc;
    } else {
      return '/';
    }
  };
  // 获取实测值
  getText = (record) => {
    const { limisCenterControl } = this.props;
    if(limisCenterControl.length < 1) return; //central lutetiumExport products
    const { lutetiumExport } = limisCenterControl[0];
    const arr = lutetiumExport.filter(item =>
      record.locationSearchValue.findIndex(value => value === item.location) !== -1
      && record.sampleSearchValue.findIndex(value => value === item.sampleName) !== -1
      && record.nameSearchValue.findIndex(value => value === item.nameContent) !== -1);
    const { length } = arr;
    let str = '';
    if (length > 0) {
      arr.forEach((item, index) => {
        index === arr.length - 1 ? str += `${item.textContent}` : str += `${item.textContent}/`;
      });
      return str;
    } else {
      return '/';
    }
  };
  // 获取聚合装置中控质量情况实测值
  getPolymerizerText = (record) => {
    const { limisCenterControl } = this.props;
    if(limisCenterControl.length < 1) return;
    const { central } = limisCenterControl[0];
    const arr = central.filter(item =>
      record.locationSearchValue.findIndex(value => value === item.location) !== -1
      && record.sampleSearchValue.findIndex(value => value === item.sampleName) !== -1
      && record.nameSearchValue.findIndex(value => value === item.nameContent) !== -1);
    const { length } = arr;
    let str = '';
    if (length > 0) {
      arr.forEach((item, index) => {
        index === arr.length - 1 ? str += `${item.textContent}` : str += `${item.textContent}/`;
      });
      return str;
    } else {
      return '/';
    }
  };
  renderView = (props) => {
    props.style.right = 100;
    return (
      <div {...props} />
    );
  };
  render() {
    const { videoFooterHeight } = this.props;
    const { current } = videoFooterHeight;
    const { showChart, sortIndex, chartName, dateTimes } = this.state;
    const renderContent = (value, rowSpan, colSpan) => {
      const obj = {
        children: <div dangerouslySetInnerHTML={{ __html: value }} />,
        props: {},
      };
      obj.props.rowSpan = rowSpan === undefined ? 1 : rowSpan;
      obj.props.colSpan = colSpan === undefined ? 1 : colSpan;
      return obj;
    };
    const cols = [
      {
        title: '装置名称',
        dataIndex: 'location',
        width: '12%',
        render: (value, row) => renderContent(value, row.locationRowSpan),
      }, {
        title: '样品种类',
        dataIndex: 'sampleName',
        width: '10%',
        render: (value, row) => renderContent(value, row.sampleRowSpan),
      }, {
        title: '分析项目',
        dataIndex: 'item',
        colSpan: 2,
        width: '20%',
        render: (value, row) => {
          if (row.item === null) {
            return renderContent(row.name, row.itemRowSpan, 2);
          } else {
            return renderContent(value, row.itemRowSpan);
          }
        },
      }, {
        title: '项目值',
        dataIndex: 'name',
        colSpan: 0,
        width: '18%',
        render: (value, row) => {
          if (row.item === null) {
            return renderContent(value, 1, 0);
          } else {
            return renderContent(value);
          }
        },
      }, {
        title: '控制指标',
        dataIndex: 'mplDesc',
        width: '10%',
        render: (text, record) => {
          const str = this.getMplDesc(record);
          return str;
        },
      }, {
        title: '实测值',
        dataIndex: 'text',
        width: '30%',
        render: (value, row) => {
          return this.getText(row);
        },
      },
    ];
    const polymerizerCols = [
      {
        title: '装置',
        dataIndex: 'location',
        width: 100,
        render: (value, row) => renderContent(value, row.locationRowSpan),
      }, {
        title: '牌号',
        dataIndex: 'samplingPoint',
        width: 80,
        render: (value, row) => renderContent(value, row.locationRowSpan),
      }, {
        title: '样品名称',
        dataIndex: 'sampleName',
        width: 80,
        render: (value, row) => renderContent(value, row.sampleRowSpan),
      }, {
        title: '分析项目',
        dataIndex: 'name',
        width: 140,
      }, {
        title: '实测值',
        dataIndex: 'text',
        width: 180,
        render: (value, row) => {
          return this.getPolymerizerText(row);
        },
      },
    ];
    return (
      <div className={styles.warp}>
        <div className={styles.title}>
          <div className={styles.left} />
          <div className={styles.text}>中韩石化质量控制日报（二）</div>
          <div className={styles.left} />
        </div>
        <div className={styles.dataSource}>数据来源: LIMS系统</div>
        { showChart ? <Trend click={this.rawClick} sortIndex={sortIndex} name={chartName} dateTimes={dateTimes} /> : (
          <div className={styles.content}>
            <div className={styles.timeArea}>
              <div className={styles.creatTime}>制表时间:
                <DatePicker
                  defaultValue={moment(moment().subtract(1, 'days').valueOf())}
                  allowClear={false}
                  onChange={this.onChange}
                />
              </div>
            </div>
            <Scrollbars className={styles.scrollbarsStyle}>
              <div className={styles.secondTitle}>液体产品馏出口质量情况</div>
              <Table
                dataSource={fakeData[0].outlet}
                columns={cols}
                pagination={false}
                rowClassName={(record, index) => {
                    return index % 2 === 0 ? styles.blue : styles.blueRow;
                        }}
                bordered
                scroll={{ y: current === 0 ? 560 : 370 }}
              />
              <div className={styles.secondTitle}>聚合装置中控质量情况</div>
              <Table
                dataSource={fakeData[0].polymerizer}
                columns={polymerizerCols}
                pagination={false}
                rowClassName={(record, index) => {
                  return index % 2 === 0 ? styles.blue : styles.blueRow;
                }}
                bordered
                scroll={{ y: current === 0 ? 560 : 370 }}
              />
            </Scrollbars>
          </div>
        ) }
      </div>
    );
  }
}
