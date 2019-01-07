import React, { PureComponent } from 'react';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { connect } from 'dva';
import { Card, DatePicker, Button } from 'antd';
import styles from './index.less';
import WEditor from '../../../../components/WEditor/index';

@connect(({ productionDaily }) => ({
  productionStatus: productionDaily.productionStatus,
  startTimes: productionDaily.startTimes,
}))
class ProductionStatus extends PureComponent {
  state = {
    value: '',
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'productionDaily/getProductionStatus',
      payload: {},
    });
  }
  // 时间搜索
  onTimeChange = (date, dateString) => {
    const startTimes = date ? (date.format('X') * 1000) : (moment().format('X') * 1000);
    this.props.dispatch({
      type: 'productionDaily/getProductionStatus',
      payload: { startTimes },
    });
    this.props.dispatch({
      type: 'productionDaily/saveStartTimes',
      payload: { startTimes },
    });
  };
  onValueChange = (value) => {
    this.setState({
      value,
    });
  };
  save = () => {
    const { startTimes, dispatch } = this.props;
    const { productionStatus } = this.props;
    const status = productionStatus[0] || {};
    status.reportInfo = this.state.value;
    status.reportDates = status.reportDate;
    delete status.reportDate;
    dispatch({
      type: 'productionDaily/updateProductionStatus',
      payload: { startTimes, ...status },
    });
  };
  render() {
    const { productionStatus } = this.props;
    const status = productionStatus[0] || {};
    const length = Object.keys(status).length;
    return (
      <div className={styles.content}>
        <div className={styles.searchTime}>
          <span>查询日期:</span><DatePicker onChange={this.onTimeChange} defaultValue={moment().add(-1, 'day')} />
        </div>
        <Card title="生产情况" extra={<Button type="primary" onClick={this.save}>保存</Button>}>
          { length > 0 ? (
            <WEditor onChange={this.onValueChange} content={status.reportInfo} />
          ) : '暂无数据'
          }
        </Card>
      </div>
    );
  }
}
export default connect()(ProductionStatus);
