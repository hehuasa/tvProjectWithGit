import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Scrollbars from 'react-custom-scrollbars';
import moment from 'moment';
import { Table, DatePicker } from 'antd';
import Trend from '../chart/Trend';
import { fakeData } from '../List/lib/data.js';
import styles from '../index.less';
import ProductTable from './ProductTableComponent/index';

const locaArr = ['HDPE', 'LLDPE', 'ST-PP', 'JPP'];
@connect(({ productionDaily, homepage }) => ({
  limisProduct: productionDaily.limisProduct,
  timeUsePre: productionDaily.timeUsePre,
  videoFooterHeight: homepage.videoFooterHeight,
}))
export default class EquipmentProductInfo extends PureComponent {
  state = {
    showChart: false,
    sortIndex: '',
    chartName: '',
    dateTimes: null,
    data: [], // 下方装置产品信息
  };
  componentDidMount() {
    const yesterday = moment().subtract(1, 'days').valueOf();
    this.props.dispatch({
      type: 'productionDaily/getLimisProduct',
      payload: { sampleType: '产品', sampledDate: yesterday },
    }).then(() => {
      this.getLocationData(locaArr);
    });
  }
  // 按时间获取装置信息
  onChange = (date) => {
    const startDate = date.valueOf();
    this.props.dispatch({
      type: 'productionDaily/getLimisProduct',
      payload: { sampleType: '产品', sampledDate: startDate },
    }).then(() => {
      this.getLocationData(locaArr);
    });
  };
  // 获取不同装置的数据 参数：location 数组
  getLocationData = (params) => {
    const { limisProduct } = this.props;
    const data = [];
    params.forEach((location) => {
      const locationArr = limisProduct.filter(item => item.location === location);
      const sampleNameArr = Array.from(new Set(locationArr.map(item => item.sampleName)));
      sampleNameArr.forEach((obj) => {
        const locationObj = {};
        const arr = locationArr.filter(item => item.sampleName === obj);
        locationObj.sampleName = obj;
        locationObj.samplingPoint = arr.length > 0 ? arr[0].samplingPoint : '';
        locationObj.data = arr;
        data.push(locationObj);
      });
    });
    this.setState({
      data,
    });
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
    const { limisProduct } = this.props;
    const arr = limisProduct.filter(item =>
      record.sampleSearchValue.findIndex(value => value === item.sampleName) !== -1
      && record.nameSearchValue.findIndex(value => value === item.nameContent) !== -1);
    const { length } = arr;
    if (length > 0) {
      return arr[0].mplDesc;
    } else {
      return '/';
    }
  };
  // 获取罐号批号
  getSamplingPoint = (record) => {
    const { limisProduct } = this.props;
    const arr = limisProduct.filter(item =>
      record.sampleSearchValue.findIndex(value => value === item.sampleName) !== -1);
    const { length } = arr;
    let str = '';
    if (length > 0) {
      const pointObj = {};
      arr.forEach((item, index) => {
        pointObj[item.numericId] = index;
      });
      for (const key in pointObj) {
        str += `${key}<br>`;
      }
      return str;
    } else {
      return '/';
    }
  };
  // 获取实测值
  getText = (record) => {
    const { limisProduct } = this.props;
    const arr = limisProduct.filter(item =>
      record.sampleSearchValue.findIndex(value => value === item.sampleName) !== -1
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
        title: '产品',
        dataIndex: 'sampleName',
        width: '12%',
        render: (value, row) => renderContent(value, row.sampleRowSpan),
      }, {
        title: '批号',
        dataIndex: 'samplingPoint',
        width: '10%',
        render: (value, row) => {
          return renderContent(this.getSamplingPoint(row), row.sampleRowSpan);
        },
      }, {
        title: '等级',
        dataIndex: 'range',
        width: '8%',
        render: (value, row) => {
          return renderContent(value, row.sampleRowSpan);
        },
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
        width: '10%',
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
    return (
      <div className={styles.warp}>
        <div className={styles.title}>
          <div className={styles.left} />
          <div className={styles.text}>中韩石化质量控制日报（三）</div>
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
              <div className={styles.secondTitle}>产品质量情况</div>
              <Table
                dataSource={fakeData[0].limisProduct}
                columns={cols}
                pagination={false}
                rowClassName={(record, index) => {
                    return index % 2 === 0 ? styles.blue : styles.blueRow;
                        }}
                bordered
                scroll={{ y: current === 0 ? 560 : 370 }}
              />
              <div className={styles.tableWidth}>
                {
                  this.state.data.map((obj, index) => {
                    return <ProductTable data={obj} key={index} current={current}/>;
                  })
                }
              </div>
            </Scrollbars>
          </div>
        ) }
      </div>
    );
  }
}
