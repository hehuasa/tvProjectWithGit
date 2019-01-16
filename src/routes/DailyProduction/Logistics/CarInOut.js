import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Scrollbars from 'react-custom-scrollbars';
import moment from 'moment';
import { Table, Select, DatePicker } from 'antd';
import Trend from '../chart/Trend';
import styles from '../index.less';

const { Option } = Select;
@connect(({ productionDaily, homepage }) => ({
  carInOut: productionDaily.carInOut,
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
    this.props.dispatch({
      type: 'productionDaily/getCarInOut',
      payload: moment().valueOf(),
    });
  }
  // 按时间获取装置信息
  onChange = (date) => {
    const startDate = date.valueOf();
    this.props.dispatch({
      type: 'productionDaily/getCarInOut',
      payload: startDate,
    });
  };
  // 点击行
  rawClick = (record) => {
    this.setState({
      showChart: !this.state.showChart,
      sortIndex: record.sortIndex,
      chartName: record.rawName,
    });
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
      const cols = [
        { title: '进厂时间',
          dataIndex: 'inFatoryTime',
          width: 180,
        },
        { title: '状态',
          dataIndex: 'state',
          width: 80,
        }, { title: '运行状态',
          dataIndex: 'runState',
          width: 100,
        }, { title: '排队号',
          dataIndex: 'queuingNumbe',
          width: 100,
        }, { title: '卡/单号',
          dataIndex: 'orderNumber',
          width: 100,
        }, { title: '产品名称',
          dataIndex: 'productName',
          width: 200,
        }, { title: '前车牌号',
          dataIndex: 'frontCarNumber',
          width: 120,
        }, { title: '车辆类型',
          dataIndex: 'carType',
          width: 100,
        }, { title: '进出类别',
          dataIndex: 'inOutType',
          width: 100,
        }, { title: '驾驶员姓名',
          dataIndex: 'driverName',
          width: 110,
        }, { title: '联系手机',
          dataIndex: 'mobile',
          width: 140,
        }, { title: '领取防火罩时间',
          dataIndex: 'receaveFlashHider',
          width: 180,
        }, { title: '通知进厂时间',
          dataIndex: 'notifyInFatoryTime',
          width: 180,
        }, { title: '车位',
          dataIndex: 'parkingLot',
          width: 150,
        }, { title: '进厂门岗',
          dataIndex: 'inFatoryDoor',
          width: 120,
        }, { title: '发货时间',
          dataIndex: 'deliveryTime',
          width: 180,
        }, { title: '出厂门岗',
          dataIndex: 'outFatoryDoor',
          width: 120,
        }, { title: '出厂时间',
          dataIndex: 'outFatoryTime',
          width: 180,
        },
      ];
      return (
        <div className={styles.warp}>
          <div className={styles.title}>
            <div className={styles.left} />
            <div className={styles.text}>车辆实时进出厂监控</div>
            <div className={styles.left} />
          </div>
          <div className={styles.dataSource}>数据来源: 物流系统</div>
          { showChart ? <Trend click={this.rawClick} sortIndex={sortIndex} name={chartName} dateTimes={dateTimes} /> : (
            <div className={styles.content}>
              <div className={styles.timeArea}>
                <div className={styles.creatTime}>制表时间:
                  <DatePicker
                    defaultValue={moment()}
                    allowClear={false}
                    onChange={this.onChange}
                  />
                </div>
              </div>
              <Scrollbars className={styles.scrollbarsStyle}>
                <Table
                  dataSource={this.props.carInOut}
                  columns={cols}
                  pagination={false}
                  rowClassName={(record, index) => {
                    return index % 2 === 0 ? styles.blue : styles.blueRow;
                        }}
                  bordered
                  scroll={{ x: 2340, y: current === 0 ? 620 : 430 }}
                />
              </Scrollbars>
            </div>
        ) }
        </div>
      );
    }
}
